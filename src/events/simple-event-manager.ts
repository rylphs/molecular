import { EventManager } from './event-manager';
import { Subject } from 'rxjs/Subject';


/**
 * Class used internally by molecular for process
 * events in a non electron environment.
 * @Internal
 */
export class SimpleEventManager implements EventManager {
    private events: Subject<{}>[];

    constructor(config: any) {

    }

    fire(event: string, argument: any) {
        this.events[event].next(argument);
    }

    listenTo(event: any, callback: (arg: any) => void) {
        this.events[event].subscribe(callback);
    }

}
