export interface SerializeMethod {
        serialize: (object: any) => any,
        deserialize: (value: any) => any
}

export interface SerializerRegistry {
    [name: string]: SerializeMethod
}

export class Serializer {
    constructors: {
        [name: string]: (...args) => any
    } = {};
    serializers: SerializerRegistry = {
        Date: {
            serialize: (date: Date) => date.getTime(),
            deserialize: (time: any) => new Date(time)
        },
        RegExp: {
            serialize: (exp: RegExp) => exp.toString(),
            deserialize: (exp: string) => new RegExp(exp)
        }
    };

    isSerializable(object: any) {
        // Primitives and Wrappers are serializable
        if(this.isPrimitive(object)) return true;
        const className = object.constructor.name;
        // Non primitives, check for serializers
        if(this.serializers[className]) return true;
        // Other objects check if is possible to serialize recursivelly
        for(const prop in object) {
            if(!this.isSerializable(object[prop])) return false;
        }
        return true;
    }

    addSerializer(cls: new(...any) => any, serializer?: SerializeMethod) {
        if(serializer) this.serializers[(<any> cls).name] = serializer;
    }

    addConstructor(cls: new(...any) => any, constructor?: any) {
        this.constructors[(<any> cls).name] = constructor || (() => new cls());
    }

    serialize(object: any) {
        if(this.isPrimitive(object)) return object;
         const className = object.constructor.name;
         const serialized = {
             type: className,
             data: {}
         };

         // data is an Array, serialize values
         if(object instanceof Array) {
             serialized.data = object.map((value)=> this.serialize(value));
             return serialized;
         }

        // data is non primitives, check for serializers
        if(this.serializers[className]) {
            serialized.data = this.serializers[className].serialize(object);
            return serialized;
        }

        // Other objects try to serialize recursivelly
        for(const prop in object) {
            serialized.data[prop] = this.serialize(object[prop]);
        }
        return serialized;
    }

    deserialize(data: any) {
        if(this.isPrimitive(data)) return data;

         const className = data.type;

         // data is Array, deserealize values
         if(className === 'Array') {
             return data.data.map((value)=> this.deserialize(value));
         }

        // data is non primitives, check for serializers
        if(this.serializers[className]) {
            return this.serializers[className].deserialize(data.data);
        }

        // Other objects try to serialize recursivelly
        const instance = this.constructors[className] ?
            this.constructors[className](data.data) : {};
        for(const prop in data.data) {
            instance[prop] = this.deserialize(data.data[prop]);
        }
        return instance;
    }

    private isPrimitive(arg) {
        const wrappers = [Number, String, Boolean, Symbol];
        if(arg === null) return true;
        return typeof arg !== 'object' ? true :
            wrappers.some((wrapper) => wrapper === arg.constructor);
    }
}
