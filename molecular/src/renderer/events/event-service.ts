import { Injectable } from '@angular/core';
import { ElectronUtils } from '../../shared/electron-utils';
import { ElectronEventService } from './electron-event.service';
import { SimpleEventService } from './simple-event.service';
type BoundCallback = (data: any, instances: any[]) => void;
type NormalCallback = (data: any) => void;

/**
 * Abstracts events operations.
 *
 * @interface EventService
 */
@Injectable()
export abstract class EventService {
    protected instances = [];

    registerInstance(instance: any) {
        this.instances.push(instance);
    }

    listenTo(event: string,
        callback: (...data) => void, cls: any) {

        callback = this.createBoundCallback(cls, callback);
        this.registerListener(event, callback);
    }
    fire(event: string, data: any[]) { }

    protected abstract registerListener(event, callback);

    private createBoundCallback(cls: any, callback: any): BoundCallback {
        const instances = this.instances;
        return function (e: any, data: any) {
            for (const i in this.instances) {
                if (this.instances[i] instanceof cls.constructor) {
                    callback.call(instances[i], data);
                }
            }
        }.bind(this);
    }
}
