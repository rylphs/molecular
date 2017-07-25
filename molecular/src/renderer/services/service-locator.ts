import {Serializer} from '../../shared/serializer';
import { remote, ipcRenderer } from 'electron';
import { ReflectiveKey } from '@angular/core';
import { Events } from '../../shared/events';

/**
 * Sets up a factory for services inside electron
 * * Usage (Inside the module, before NgModule decorator):
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
    private serializer: Serializer;

    /**
    * Function to generate module providers param
    * * Usage (Inside the module, before NgModule decorator):
    *
    * ```
    *  import {ServiceLocator} from 'molecular';
    *
    *  @ServiceLocator.provide(MolecularManagedService)
    *  @NgModule({
    *      declarations: [...],
    *      imports: [...],
    *      providers: [AngularManagedService],
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
        const locator = new ServiceLocator(services);
        return function(module){
            locator.provideServicesFor(module);
        }
    }

    private constructor(services: any[]) {
        this.services = services;
        this.serializer = new Serializer();
    }

    private provideServicesFor(module: new() => any) {
        const meta = Reflect.getMetadata('annotations', module);
        for(const i in meta) {
            if(meta[i].providers instanceof Array) {
                meta[i].providers = meta[i].providers.concat(this.createProviders());
            }
        }
    }

    private createServiceFactory(service: any) {
        const thisInstance = this;
        return function () {
            const token = ReflectiveKey.get(service).displayName;
            const instance = ipcRenderer.sendSync(Events.GET_SERVICE, token);
            return thisInstance.proxyAcess(service, instance, token);
        };
    }

    private proxyAcess(service, instance, token) {
        const properties = Object.getOwnPropertyNames(service.prototype);
        const proxy = Object.create(service.prototype);
        const serializer = this.serializer;

        for(const i in properties) {
            const prop = properties[i];
            if(prop === 'constructor') continue;

            if(service.prototype[prop] instanceof Function) {
                proxy[prop] = function(){
                    return serializer.deserialize(
                        ipcRenderer.sendSync(Events.CALL_METHOD, token, prop, ...arguments)
                    );
                }
            }
            else {
                Object.defineProperty(proxy, prop, {
                    get: function(){
                        return ipcRenderer.sendSync(Events.GET_PROPERTY, token, prop);
                    },
                    set: function(value: any) {
                        return ipcRenderer.sendSync(Events.SET_PROPERTY, token, prop, value);
                    }
                })
            }
        }
        return proxy;
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
