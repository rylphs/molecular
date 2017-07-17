import { EventManager } from './event-manager';
import { ipcRenderer, remote } from 'electron';
import { ElectronEventBus } from './electron-event-bus';


/**
 * Class used internally by molecular for process events in a electron environment.
 * @Internal
 */
export class ElectronProcessEventManager implements EventManager {
    private eventBus: ElectronEventBus;

    constructor() {
        this.eventBus = new ElectronEventBus();
    }

    fire(event: string, ...data: any[]) {
        this.eventBus.raiseEvent(event, ...data);
    }

    listenTo(event: any, callback: (arg: any) => void) {
        const window = remote.getCurrentWindow();

        this.eventBus.registerListener(window.id, event, callback);
    }
}
