import { Subject } from 'rxjs/Subject';
import { ElectronEventBus } from './event-bus';
import { ElectronProcessEventManager } from './electron-process-event-manager';

export const Fires = function(eventName: string) {
    return function (target: any, key: string, definition: any) {
        const originalMethod = definition.value;
        definition.value = function (...args: any[]) {
            const result = originalMethod.call(this, args);
            new ElectronProcessEventManager().fire(eventName, result);
        }
        Object.defineProperty(target, key, definition);
    }
}

export const ListenTo = function(eventName: string) {
    return function (target: any, key: string, definition: any) {
        const originalMethod = definition.value;
        new ElectronProcessEventManager().listenTo(eventName, originalMethod);
    }
}

export interface EventManager {
    fire(event: string, argument: any);

    listenTo(event: any, callback: (arg: any) => void);
}
