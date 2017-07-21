import { remote, ipcRenderer } from 'electron';
import { ReflectiveInjector, ReflectiveKey, Injectable } from '@angular/core';
import { REGISTER_SERVICE } from '../../shared/events';


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
    private injector: ReflectiveInjector;
    private services: any[];
    private key: string;
    private registry: any;


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
    static provide(key: string, ...services: any[]) {
        return new ServiceLocator(key, services).createProviders();
    }

    private constructor(key: string, services: any[]) {
        this.key = key;
        this.services = services;

        // Enable to allow remote calling of services
        // services.forEach((service) => Reflect.decorate([Injectable()], service));

        const baseProviders = services.map(function(service: any){
            return { provide: service, useClass: service };
        });
        const providers = ReflectiveInjector.resolve(baseProviders);
        this.injector = ReflectiveInjector.fromResolvedProviders(providers);
    }

    public createServiceFactory(service: any) {
        const thisInstance = this;
        return function () {
            const instance = thisInstance.injector.get(service);
            const token = ReflectiveKey.get(service).displayName;
            const o: any = ipcRenderer.sendSync(REGISTER_SERVICE, thisInstance.key, token, instance);
            for(const prop in service.prototype) {
                const s = service.prototype[prop];
                if(s instanceof Function){
                    o[prop] = s;
                }
            }
            return o;
        };
    }

    private toInjectable(service){
         const injectable = Injectable();
         injectable.call(injectable, service);
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
