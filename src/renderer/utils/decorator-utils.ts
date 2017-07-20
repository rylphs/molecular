import 'reflect-metadata';

// a utility function to generate instances of a class
function constructInstance(fn: Function, constructor: Function, args: any) {
    const c: any = function () {
        fn.apply(this, args);
        return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    return new c();
}

export function createConstructor(baseConstructor: any, callback: any, includeMetadata: boolean = false) {
    console.log('working ing ', baseConstructor);
    const newConstructor: any = function (...args: any[]) {
        return constructInstance(callback, baseConstructor, args);
    }
    newConstructor.prototype = baseConstructor.prototype; // copy prototype (fix intanceof)
    if (includeMetadata) {
        const metaData = Reflect.getMetadataKeys(baseConstructor);
        for (const i in metaData) {
            const key = metaData[i];
            const value = Reflect.getMetadata(key, baseConstructor)
            Reflect.defineMetadata(key, value, newConstructor);
        }
    }
    return newConstructor; // return new constructor (will override original)
}

export function copyMetadata(src, dst){
    const metaData = Reflect.getMetadataKeys(src);
        for (const i in metaData) {
            const key = metaData[i];
            const value = Reflect.getMetadata(key, src)
            Reflect.defineMetadata(key, value, dst);
        }
}
