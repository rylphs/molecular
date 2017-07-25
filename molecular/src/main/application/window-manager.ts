import { remote, screen, BrowserWindow, app } from 'electron';
import { ElectronUtils } from '../../shared/electron-utils';


export type WindowEntry = Electron.BrowserWindowConstructorOptions & {
    parent?: WindowEntry; // TODO: Check wheather parent should be string instead.
    listenTo?: any,
    fires?: any
}

export interface WindowConfig {
    [entry: string]: WindowEntry;
}

export class WindowManager {
    private windows = {};
    private config: any;

    constructor(config: WindowConfig, private baseUrl: string) {
        this.config = config; // TODO: parse window configuration;
    }

    createMainWindow() {
        const win = this.createWindow(this.config.main);
        win.loadURL(this.baseUrl);
        win.webContents.openDevTools();
        if (ElectronUtils.isServing()) {
            win.webContents.openDevTools();
        }
        return win;
    }

    private createWindow(config) {
        const size = screen.getPrimaryDisplay().workAreaSize;
        config.width = config.width || size.width;
        config.height = config.height || size.height;
        config.x = config.x || 0;
        config.y = config.y || 0;

        const win = new BrowserWindow(config);
        return win;

    }
}
