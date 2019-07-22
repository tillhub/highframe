"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// taken from https://stackoverflow.com/a/2117523/3580261
function v4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.v4 = v4;
//# sourceMappingURL=uuid.js.map