import 'reflect-metadata';
import { ipcMain, app } from 'electron';
import { Events } from '../../shared/events';
import { Serializer } from '../../shared/serializer';

export type  ServiceClass = new(...params) => any;

export interface Providers  {
    [token: string]: UseClassProvider | UseFactoryProvider;
}

export interface UseClassProvider {
    provide: ServiceClass
    useClass: ServiceClass;
}

export interface UseFactoryProvider {
    provide: ServiceClass
    useFactory: () => any;
}

export type ProviderConfig = Array<UseClassProvider | UseFactoryProvider | ServiceClass>;

/**
 * Registry used internally by molecular to
 * register and retrieve services.
 *
 * @class ServiceRegistry
 */
export class ServiceRegistry {
    private registry = {};
    private providers: Providers;

    constructor(providers: ProviderConfig, private serializer: Serializer) {
        providers = providers || [];
        for(const i in providers) {
            let provider = providers[i];
            if(!this.isProvider(provider)) {
                provider = {provide: provider, useClass: provider}
            }
            this.providers[provider.provide.name] = provider;
        }
    }

    setup() {
        ipcMain.on(Events.GET_SERVICE, function (event, token) {
            if (!this.registry[token]) {
                this.registry[token] = this.instantiate(token);
            }
            event.returnValue = this.registry[token];
        }.bind(this));

        ipcMain.on(Events.CALL_METHOD, function (event, token: string, method: string, ...parameters) {
            if (!this.registry[token]) return;
            const service = this.registry[token]
            parameters = parameters.map(this.serializer.deserialize.bind(this.serializer));
            const result = service[method].call(service, parameters);
            event.returnValue = this.serializer.serialize(result);
        }.bind(this));

        ipcMain.on(Events.GET_PROPERTY, function (event, token: string, prop: string) {
            if (!this.registry[token]) return;
            const service = this.registry[token]
            event.returnValue = this.serializer.serialize(service[prop]);
        }.bind(this));

         ipcMain.on(Events.SET_PROPERTY, function (event, token: string, prop: string, value: any) {
            if (!this.registry[token]) return;
            value = this.serializer.deserialize(value);
            this.registry[token][prop] = value;
        }.bind(this));
    }

    private isProvider(
        provider: UseFactoryProvider |
            UseClassProvider | ServiceClass): provider is UseClassProvider | UseFactoryProvider {
        return (<any>provider).provide ? true : false;
    }

    private isFactoryProvider(
        provider: UseFactoryProvider |
            UseClassProvider | ServiceClass): provider is UseFactoryProvider {
        return (<UseFactoryProvider>provider).useFactory ? true : false;
    }

    private instantiate(token) {
        if(!this.providers[token]) {
            // TODO: Adirionar tratamento de erro. Provider nao registrado.
            return;
        }
        const provider = this.providers[token];
        if(this.isFactoryProvider(provider)) {
            return provider.useFactory();
        }
        const typeParameters: any[] = Reflect.getMetadata('design:paramtypes', provider.useClass);
        const parameters = [];
        for (const i in typeParameters) {
            const parameter = typeParameters[i];
            parameters.push(this.instantiate(parameter.name));
        };
        return new provider.provide(...parameters);
    }


    private registerMethodListener(key, token, method) {
        ipcMain.on('method.' + token + '.' + key + '.' + method, (event, ...args) => {
            const instance = this.registry[token][key];
            event.returnValue = instance[method].apply(instance, args);
        });
    }
}


