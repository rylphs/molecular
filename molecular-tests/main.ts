import {ElectronManagedService} from './src/app/services/electron-managed.service';
import { MolecularApp } from 'molecular/build/main';
import { app, BrowserWindow, screen, Tray, Menu, dialog, ipcMain } from 'electron';
import * as path from 'path';
import 'reflect-metadata';

const karmaUrl = 'http://127.0.0.1:9876';

const m: MolecularApp = new MolecularApp({
  windows: {
    main: {
      webPreferences: {
        webSecurity: false
      },
      icon: 'assets/smg-cli.png'
    },
    baseURL: karmaUrl
  },
  providers: [ElectronManagedService],
  global: {
    appPath: app.getAppPath(),
    concurrency: 2
  }
});

ipcMain.on('criar', (event, id) => {
  const baseURL = 'file://' + app.getAppPath() + '/index.html';
  const w = BrowserWindow.fromId(id);
  const nw = new BrowserWindow({
    parent: w
  });
  nw.webContents.openDevTools();
  nw.loadURL(baseURL + '#pocwindow');
})
