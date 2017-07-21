import {ipcMain, app} from 'electron';
import { REGISTER_SERVICE } from '../../shared/events';

/**
 * Registry used internally by molecular to
 * register and retrieve services.
 *
 * @class ServiceRegistry
 */
export class ServiceRegistry {
    private services = {};
    private registry = {};

    register(token, service){
        this.services[token] = service;
    }

    setup() {
        ipcMain.on(REGISTER_SERVICE, function(event, key, token, instance){
            if (!this.registry[key]) this.registry[key] = {};
            if (!this.registry[key][token]) { 
                this.registry[key][token] = instance;
            }
            event.returnValue = this.registry[key][token];
        }.bind(this));
    }
}


