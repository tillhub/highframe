export declare class SerializationError extends Error {
    static code: string;
    originalError?: Error;
    constructor(message?: string, originalError?: Error);
}
export declare class DeserializationError extends Error {
    static code: string;
    originalError?: Error;
    constructor(message?: string, originalError?: Error);
}
