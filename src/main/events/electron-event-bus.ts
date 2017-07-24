import { ElectronUtils } from '../../shared/electron-utils';
import { app, ipcMain, BrowserWindow} from 'electron';
import { Events } from '../../shared/events';

interface EventChannel {
    [id: number]: { send(channel: string, ...args: any[]): void };
}

/**
 * Class used internally by molecular to change messages
 * between electron main process and windows (renderes).
 *
 * @class ElectronEventBus
 */
// TODO: Handle situations where listener is in main process
export class ElectronEventBus {
    private eventChannels: {
        [event: string]: EventChannel
    } = {};

    constructor() { }

    setup() {
        if (!ElectronUtils.isMainProcess()) return;

        ipcMain.on(Events.LISTENER_ADDED, this.setupNewListener.bind(this));
        ipcMain.on(Events.EVENT_RAISED, this.handleEvent.bind(this));
    }

    private setupNewListener(e: any, windowId: number, event: string) {
        // TODO: Refatorar para usar e.sender no lugar de windowID
        const window = BrowserWindow.fromId(windowId);
        this.eventChannels[event] = this.eventChannels[event] || {};
        this.eventChannels[event][windowId] = window.webContents;

        window.on('close', () =>
            delete this.eventChannels[event][windowId]
        );
    }

    private handleEvent(e: any, event: string, ...data: any[]) {
        const listeners = this.eventChannels[event];
        for (const i in listeners) {
            const channel = listeners[i];
            channel.send(event, ...data);
        }
    }
}
