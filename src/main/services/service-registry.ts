import {ipcMain, app} from 'electron';
import { REGISTER_SERVICE } from '../../shared/events';
import 'reflect-metadata';

/**
 * Registry used internally by molecular to
 * register and retrieve services.
 *
 * @class ServiceRegistry
 */
export class ServiceRegistry {
    private services = {};
    private registry = {};

    register(token, service) {
        this.services[token] = service;
    }

    setup() {
        ipcMain.on(REGISTER_SERVICE, function(event, key, token, instance){
            if (!this.registry[key]) this.registry[key] = {};
            if (!this.registry[key][token]) {
                this.registry[key][token] = this.instantiate(key, token);
            }
            event.returnValue = this.registry[key][token];
        }.bind(this));
    }

    private instantiate(key, token) {
        if(this.registry[key] && this.registry[key][token]) return this.registry[key][token];

        const service = this.services[token];
        const typeParameters: any[] = Reflect.getMetadata('design:paramtypes', service);
        const parameters = [];
        for(const i in typeParameters) {
            for(const serviceToken in this.services){
                if(this.services[serviceToken] === typeParameters[i]) {
                    parameters.push(this.instantiate(key, serviceToken));
                }
            }
        };
        return new service(...parameters);
    }

    private registerMethodListener(token, key, method){
        ipcMain.on('method.' + token + '.' + key + '.' + method, (event, args) => {
            const instance = this.registry[token][key];
        });
    }
}


