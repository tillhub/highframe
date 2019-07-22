declare enum HighframeEventType {
    event = 1
}
export declare class HighframeMessage {
    args: any[];
    event: string;
    type: HighframeEventType;
    isHighframe: boolean;
    id: string;
    constructor(event: string, args?: any[]);
    serialize(): string;
    private static hasMessageSignature;
    static deserialize(rawMessage: string, e?: MessageEvent): HighframeMessage | undefined;
}
export {};
