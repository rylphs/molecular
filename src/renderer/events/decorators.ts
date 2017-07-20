import { ElectronUtils } from '../../shared/electron-utils';
import {ReflectiveInjector} from '@angular/core';
import {createConstructor} from '../utils/decorator-utils';
import { EventService } from './event-service';
import { ElectronEventService } from './electron-event.service';
import { SimpleEventService } from './simple-event.service';

const providers = ReflectiveInjector.resolve([
        {provide: EventService, useFactory: eventServiceFactory}
]);
const injector = ReflectiveInjector.fromResolvedProviders(providers);

function eventServiceFactory(): EventService {
    if(ElectronUtils.isInElectron()) {
        return new ElectronEventService();
    }
    return new SimpleEventService();
}

// TODO: Refatorar para usar classes

function getEventService(): EventService {
    return injector.get(EventService);
}

/**
 * Enables the class decorated to listen to events.
 * The listener methods must be decorated with `@ListenTo`
 * * Usage:
 *
 * ```
 *  @Listener()
 *  class SomeClass{
 *      @ListenTo( 'myEvent')
 *      calledOnMyEvent(firstEventParameter, secondEventParameter) {
 *          this.myMethod(); //this correctely bound
 *          //doSomething...
 *      }
 *  }
 * ```
 *
 * @classDecorator
 * @param {string} eventName
 * @returns
 */
export function Listener(targetConstructor: any) {
    function registerInstance() {
        getEventService().registerInstance(this);
    }
    return createConstructor(targetConstructor, registerInstance, true);
}

/**
 * Causes the method decorated to fire the event specified.
 * * Usage:
 *
 * ```
 *  @Fires('myEvent')
 *  firesMyEvent(firstEventParameter, secondEventParameter) {
 *      //do something
 *      return "result"; // result will be added as event parameter
 *  }
 * ```
 *
 * @methodDecorator
 * @param {string} eventName
 * @returns
 */
export function Fires(eventName: string) {
    console.log('fires');
    return function (target: any, key: string, definition: any) {
        const originalMethod = definition.value;
        definition.value = function (...args: any[]) {
            const result = originalMethod.call(this, args);
            getEventService().fire(eventName, result);
        }
        Object.defineProperty(target, key, definition);
    }
}


/**
 * Causes the method to be called every time the event is fired.
 * The class must also be decorated with `@Listener`.
 * * Usage:
 *
 * ```
 *  @ListenTo("myEvent")
 *  calledOnMyEvent(firstEventParameter, secondEventParameter) {
 *      //doSomething...
 *  }
 * ```
 *
 * @methodDecorator
 * @param {string} eventName
 * @returns
 */
export function ListenTo(eventName: string) {
    return function (target: any, key: string, definition: any) {
        const originalMethod = definition.value;
        getEventService().listenTo(eventName, originalMethod, target);
    }
}