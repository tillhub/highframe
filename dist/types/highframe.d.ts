/// <reference types="node" />
import events from 'events';
import HighframeChild from './child';
export declare function debug(...args: any[]): void;
export { HighframeChild };
interface HighframeClientElementProperties {
    frameBorder: string;
    width?: string | number;
    height?: string | number;
    allowFullscreen?: boolean;
    allowPaymentRequest?: boolean;
    name?: string;
}
interface HighframeOptions {
    src: string;
    title?: string;
    childOrigin: string;
    properties?: HighframeClientElementProperties;
}
interface HighframeClientOptions extends HighframeOptions {
    eventInterceptor?: Function;
}
interface EventMap {
    [domName: string]: EventMapItem;
}
interface EventMapItem {
    name: string;
}
export declare interface HighframeClient {
    on(event: string, listener: Function): this;
}
export declare class HighframeClient extends events.EventEmitter {
    options: HighframeClientOptions;
    static environment: {
        VERSION: any;
    };
    initialized: boolean;
    target: HTMLIFrameElement;
    protected static EventMap: EventMap;
    private boundEvents;
    private handler?;
    constructor(target: HTMLIFrameElement, options: HighframeClientOptions);
    private _emit;
    sendMessage(type: string, ...args: any[]): void;
    private bindEvents;
    private attach;
    private handleMessage;
}
export default class Highframe extends events {
    static debug: boolean;
    client: HighframeClient;
    holder: HTMLElement;
    constructor(holder: HTMLElement, options: HighframeOptions);
    private handleClientEvent;
    dispatch(type: string, ...args: any[]): boolean;
    private static removeChildren;
    private static appendChild;
    private static createClientTarget;
    static create(target: HTMLElement, options: HighframeClientOptions): Highframe;
}
