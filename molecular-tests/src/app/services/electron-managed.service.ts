import {ipcMain, app} from 'electron';

export class ElectronManagedService {
    constructor(){
        console.log('ipcMain? ', ipcMain)
    }

    p(){
        return ipcMain.eventNames();
    }
}
