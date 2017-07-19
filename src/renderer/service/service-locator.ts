import { remote } from 'electron';


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
    static provide(service: any[]) {
        const moduleId = '' // TODO: get moduleId from somewhere
        return new ServiceLocator(moduleId);
    }

    private constructor(moduleId: string) {
        this.registry = remote.require('./service-registry').for(moduleId)
    }


    /**
     * Used internally by molecular to inject services.
     *
     * @param {*} service 
     * @returns
     *
     * @memberOf ServiceLocator
     */
    locate(service: any) {
        const serviceId = '' // TODO: get serviceId from className
        return this.registry.get(service);
    }
}
