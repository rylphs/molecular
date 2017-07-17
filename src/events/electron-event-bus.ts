import { Utils } from '../util/utils';
import { app, ipcMain, BrowserWindow, ipcRenderer, remote } from 'electron';

/**
 * Class used internally by molecular to change messages
 * between electron main process and windows (renderes).
 *
 * @class ElectronEventBus
 */
export class ElectronEventBus {
    private LISTENER_ADDED = 'listener-added';
    private EVENT_RAISED = 'event-raised';
    private listeners: {
        [key: string]: Electron.BrowserWindow[];
    } = {};

    constructor() { }

    setupEvents() {
        if (!Utils.isMainProcess()) return;

        ipcMain.on(this.LISTENER_ADDED, this.setupNewListener.bind(this));
        ipcMain.on(this.EVENT_RAISED, this.handleEvent.bind(this));
    }

    registerListener(windowId: number, event: string, callback: (...data) => void) {
        if (Utils.isMainProcess()) return;

        ipcRenderer.send(this.LISTENER_ADDED, windowId, event);
        ipcRenderer.on(event, (e, ...data) => callback.call({}, ...data));
    }

    registerInstance(instance: any) {}

    raiseEvent(event: string, ...data: any[]) {
        if (Utils.isMainProcess()) return;

        ipcRenderer.send(this.EVENT_RAISED, event, ...data);
    }

    private setupNewListener(e: any, windowId: number, event: string) {
        const window = BrowserWindow.fromId(windowId);
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(window);
    }

    private handleEvent(e: any, event: string, ...data: any[]) {
        const windows = this.listeners[event];
        for (const i in windows) {
            const window = windows[i];
            window.webContents.send(event, ...data);
        }
    }
}
