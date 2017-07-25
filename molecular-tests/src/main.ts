import {ElectronManagedService} from './app/services/electron-managed.service';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModulet} from './app/app.module';
import { environment } from 'environments';

import {ServiceLocator} from 'molecular/build/renderer';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModulet);
