import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModulet } from './app/app.module';
import { environment } from 'environments';

import {ServiceLocator} from '../../../src/renderer';
import { ElectronManagedService } from 'app/services/electron-managed.service';

if (environment.production) {
  enableProdMode();
}

const meta = Reflect.getMetadata('annotations', AppModulet);
if (meta) {
  for (const i in meta) {
    if (!meta.hasOwnProperty(i)) { continue };
    if (meta[i].providers) {
      meta[i].providers = ServiceLocator.provide(ElectronManagedService);
    }
  }
  Reflect.defineMetadata('annotations', meta, AppModulet);
}

platformBrowserDynamic().bootstrapModule(AppModulet);
