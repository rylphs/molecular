import { app } from 'electron';

export class ElectronUtils {
    private static serve;

    static isInElectron(): boolean {
        return window && (<any>window).process && (<any>window).process.type;
    }

    static isMainProcess(): boolean {
        return (app !== undefined)
    }

    static isServing(): boolean {
        const args = process.argv.slice(1);
        if (this.serve === null) {
            ElectronUtils.serve = args.some(val => val === '--serve');
        }
        return this.serve;
    }
}
