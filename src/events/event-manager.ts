/**
 * Abstracts events operations. Used internally.
 *
 * @interface EventManager
 */
export interface EventManager {
    fire(event: string, argument: any);

    listenTo(event: any, callback: (arg: any) => void);
}

export class T {
    a = 3;
};
