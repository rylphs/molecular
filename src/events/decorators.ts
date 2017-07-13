import {ElectronProcessEventManager} from './electron-process-event-manager';

/**
 * Bind all methods decorated with ListenTo to `this` instance.
 * * Usage:
 *
 * ```
 *  @BindListeners()
 *  class SomeClass{
 *      @ListenTo("myEvent")
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
export function BindListeners() {}

/**
 * Causes the method decorated to fire the event specified.
 * * Usage:
 *
 * ```
 *  @Fires("myEvent")
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
    return function (target: any, key: string, definition: any) {
        const originalMethod = definition.value;
        definition.value = function (...args: any[]) {
            const result = originalMethod.call(this, args);
            new ElectronProcessEventManager().fire(eventName, result);
        }
        Object.defineProperty(target, key, definition);
    }
}


/**
 * Causes the method to be called every time the event is fired
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
        new ElectronProcessEventManager().listenTo(eventName, originalMethod);
    }
}