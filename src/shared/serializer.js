export class Serializer {
    constructor() {
        this.serializers = {
            Date: {
                serialize: (date) => date.getTime(),
                desserialize: (time) => new Date(time)
            },
            RegExp: {
                serialize: (exp) => exp.toString(),
                desserialize: (exp) => new RegExp(exp)
            }
        };
    }
    isSerializable(object) {
        // Primitives and Wrappers are serializable
        if (this.isPrimitive(object))
            return true;
        const className = object.constructor.name;
        // Non primitives, check for serializers
        if (this.serializers[className])
            return true;
        // Other objects check if is possible to serialize recursivelly
        for (const prop in object) {
            if (!this.isSerializable(object[prop]))
                return false;
        }
        return true;
    }
    serialize(object) {
        return this.executeSerializationMethod(object, 'serialize');
    }
    desserialize(object) {
        return this.executeSerializationMethod(object, 'desserialize');
    }
    addSerialier(cls, serializer) {
        this.serializers[cls.name] = serializer;
    }
    executeSerializationMethod(object, method) {
        if (this.isPrimitive(object))
            return object;
        const className = object.constructor.name;
        // Non primitives, check for serializers
        if (this.serializers[className])
            return this.serializers[className][method](object);
        // Other objects try to serialize recursivelly
        const serialized = {};
        for (const prop in object) {
            serialized[prop] = this.executeSerializationMethod(object[prop], method);
        }
        return serialized;
    }
    isPrimitive(arg) {
        if (arg === null)
            return true;
        return typeof arg !== 'object' ? true :
            (arg.valueOf instanceof Function) &&
                (typeof arg.valueOf() !== 'object');
    }
}
