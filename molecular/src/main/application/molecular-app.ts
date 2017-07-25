import 'reflect-metadata';
import { ServiceRegistry, ProviderConfig } from '../services/service-registry';
import { app, BrowserWindow, screen, Tray, Menu, dialog, ipcMain } from 'electron';
import { WindowConfig, WindowEntry, WindowManager } from './window-manager';
import { ElectronEventBus } from '../events/electron-event-bus';
import { Serializer } from '../../shared/serializer';


export interface PathConfiguration {
    path: string, window?: WindowEntry,
    menu?: any, component: any
}

export interface AppConfiguration {
    providers?: ProviderConfig;
    events?: any,
    windows: WindowConfig,
    paths?: PathConfiguration[],
    menus?: any,
    global?: any,
    icon?: string;
}

export class MolecularApp {
    private serializer: Serializer;
    private winManager: WindowManager;
    private eventBus: ElectronEventBus;
    private serviceRegistry: ServiceRegistry;
    private mainWindow: any;
    private appIcon: string;
    private tray: any;

    constructor(config: AppConfiguration) {
        this.eventBus = new ElectronEventBus();
        this.serializer = new Serializer();
        this.serviceRegistry = new ServiceRegistry(config.providers, this.serializer);
        this.eventBus.setup();
        this.serviceRegistry.setup();

        if (config.icon) {
            this.appIcon = app.getAppPath() + '/' + config.icon;
            config.windows.main['icon'] = this.appIcon;
            this.tray = new Tray(this.appIcon)
        }
        this.winManager = new WindowManager(config.windows);
        global['AppConfig'] = config.global
        try {
            this.setUpApp();
        } catch (e) { }

    }

    run(): void {

    }

    private setUpApp() {
        app.on('ready', () => {
            this.mainWindow = this.winManager.createMainWindow();
        });
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === null) {
                this.mainWindow = this.winManager.createMainWindow();
            }
        });
    }

}
