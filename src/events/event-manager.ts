import { Subject } from 'rxjs/Subject';
import { ElectronEventBus } from './event-bus';
import { ElectronProcessEventManager } from './electron-process-event-manager';


/**
 * Abstracts events operations. Used internally.
 *
 * @interface EventManager
 */
export interface EventManager {
    fire(event: string, argument: any);

    listenTo(event: any, callback: (arg: any) => void);
}
