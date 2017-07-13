

/**
 * Registry used internally by molecular to
 * register and retrieve services.
 *
 * @class ServiceRegistry
 */
export class ServiceRegistry {
    private services = {};

    get(service: string) {
        // get service
    }
}

const registries = {};

export function forModule(moduleId: string) {
    if (!registries[moduleId]) registries[moduleId] = new ServiceRegistry;
    return registries[moduleId];
}
