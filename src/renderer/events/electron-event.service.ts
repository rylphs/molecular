import {ElectronUtils} from '../../shared/electron-utils';
import { ipcRenderer, remote } from 'electron';
import { EventService } from './event-service';
import { LISTENER_ADDED, EVENT_RAISED } from '../../shared/events';

export class ElectronEventService extends EventService {

    registerListener(event: string, callback: (...data) => void) {
        if (ElectronUtils.isMainProcess()) return;

        const window = remote.getCurrentWindow();
        const windowId = window.id;
        ipcRenderer.send(LISTENER_ADDED, windowId, event);
        ipcRenderer.on(event, callback);
    }

    fire(event: string, ...data: any[]) {
        if (ElectronUtils.isMainProcess()) return;

        ipcRenderer.send(EVENT_RAISED, event, ...data);
    }
}