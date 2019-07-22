"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeMessage(message, options) {
    // block out wrong origins
    if (message.origin !== options.allowedOrigin)
        return false;
    // Highgrafme will never send no data, hence exclude this event here
    if (!message.data)
        return false;
    // we will sanitize fur
    return true;
}
exports.sanitizeMessage = sanitizeMessage;
//# sourceMappingURL=helpers.js.map