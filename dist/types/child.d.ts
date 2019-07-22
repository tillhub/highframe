/// <reference types="node" />
import events from 'events';
interface HighframeChildOptions {
    parentOrigin: string;
}
export default class HighframeChild extends events {
    options: HighframeChildOptions;
    private handler?;
    constructor(options: HighframeChildOptions);
    private attach;
    private handleMessage;
    ready(): void;
    private _emit;
}
export {};
