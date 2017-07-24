import { remote, ipcRenderer } from 'electron';
import { ReflectiveKey } from '@angular/core';
import { Events } from '../../shared/events';

/**
 * Sets up a factory for services inside electron
 * * Usage (Inside the module you want the provider to act):
 *
 * ```
 *  import {ServiceLocator} from 'molecular';
 *
 *  @NgModule({
 *      declarations: [...],
 *      imports: [...],
 *      providers: ServiceLocator.provide([
 *          MyServiceA, MyServiceB, ...
 *      ]),
 *      bootstrap: [AppComponent]
 *  })
 *  export class AppModule { }
 *  ```
 *
 * @class ServiceLocator
 */
export class ServiceLocator {
    private services: any[];

    /**
     * Function to generate module providers param
    * ```
    *  import {ServiceLocator} from 'molecular';
    *
    *  @NgModule({
    *      declarations: [...],
    *      imports: [...],
    *      providers: ServiceLocator.provide([
    *          MyServiceA, MyServiceB, ...
    *      ]),
    *      bootstrap: [AppComponent]
    *  })
    *  export class AppModule { }
    *  ```
     * @static
     * @param {any[]} service
     * @returns
     *
     * @memberOf ServiceLocator
     */
    static provide(...services: any[]) {
        return new ServiceLocator(services).createProviders();
    }

    private constructor(services: any[]) {
        this.services = services;
    }

    private createServiceFactory(service: any) {
        return function () {
            console.log(service);
            const token = ReflectiveKey.get(service).displayName;
            const instance = ipcRenderer.sendSync(Events.GET_SERVICE, token);
            this.proxyAcess(service, instance, token);
            return instance;
        }.bind(this);
    }

    private proxyAcess(service, instance, token) {
        for(const prop in service) {
            if(service[prop] instanceof Function) {
                instance[prop] = function(){
                    return ipcRenderer.sendSync(Events.CALL_METHOD, token, prop, arguments);
                }
            }
            else {
                Object.defineProperty(service, prop, {
                    get: function(){
                        return ipcRenderer.sendSync(Events.GET_PROPERTY, token, prop);
                    },
                    set: function(value: any) {
                        return ipcRenderer.sendSync(Events.SET_PROPERTY, token, prop, value);
                    }
                })
            }
        }
    }

    private createProviders() {
        const providers = [];
        for(const i in this.services) {
            const service = this.services[i];
            providers.push({
                provide: service,
                useFactory: this.createServiceFactory(service)
            })
        }
        return providers;
    }
}
