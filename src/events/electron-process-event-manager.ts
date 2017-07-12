import { EventManager } from './event-manager';
import { ipcRenderer, remote } from 'electron';
import { ElectronEventBus } from './event-bus';

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
