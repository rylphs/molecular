import { Subject } from 'rxjs/Subject';
import { EventService } from './event-service';

export class SimpleEventService extends EventService {
    listeners: {
        [event: string]: Subject<any[]>
    } = {};

    registerListener(event: string, callback: (...data) => void) {
       if(!this.listeners[event]) this.listeners[event] = new Subject();
       this.listeners[event].subscribe(callback);
    }

    fire(event: string, ...data: any[]) {
        if(!this.listeners[event]) return;

        this.listeners[event].next(data);
    }
}
