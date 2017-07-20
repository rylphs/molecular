import { remote, ipcRenderer } from 'electron';
import { ReflectiveInjector, ReflectiveKey } from '@angular/core';
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
        const baseProviders = services.map(function(service: any){
            return { provide: service, useClass: service };
        });
        console.log('baseProviders', baseProviders);
        const providers = ReflectiveInjector.resolve(baseProviders);
        this.injector = ReflectiveInjector.fromResolvedProviders(providers);
    }

    public createServiceFactory(service: any) {
        const thisInstance = this;
        return function () {
            console.log('trying to get instance', thisInstance);
            const instance = thisInstance.injector.get(service);
            const token = ReflectiveKey.get(service).displayName;
            console.log('factory', REGISTER_SERVICE, thisInstance.key, token, instance)
            return ipcRenderer.sendSync(REGISTER_SERVICE, thisInstance.key, token, instance);
        };
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
        console.log('providers', providers);
        return providers;
    }
}
