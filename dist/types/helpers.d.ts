interface SanitizeOptions {
    allowedOrigin: string;
}
export declare function sanitizeMessage(message: MessageEvent, options: SanitizeOptions): boolean;
export {};
