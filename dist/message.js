"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors = __importStar(require("./errors"));
var uuid_1 = require("./uuid");
var HighframeEventType;
(function (HighframeEventType) {
    HighframeEventType[HighframeEventType["event"] = 1] = "event";
})(HighframeEventType || (HighframeEventType = {}));
function isString(test) {
    return typeof test === 'string';
}
var HighframeMessage = /** @class */ (function () {
    function HighframeMessage(event, args) {
        if (args === void 0) { args = []; }
        this.type = HighframeEventType.event;
        this.isHighframe = true;
        this.event = event;
        this.args = args;
        this.id = uuid_1.v4();
    }
    HighframeMessage.prototype.serialize = function () {
        try {
            return JSON.stringify({
                event: this.event,
                args: this.args,
                id: this.id,
                isHighframe: this.isHighframe,
                type: this.type
            });
        }
        catch (originalError) {
            throw new errors.SerializationError(undefined, originalError);
        }
    };
    HighframeMessage.hasMessageSignature = function (msg) {
        var hasEventSig = msg && msg.event && isString(msg.event);
        var hasHighframeFlag = msg.isHighframe === true;
        var hasEventType = Object.values(HighframeEventType).includes(msg.type);
        var hasCorrectArgSig;
        if (!msg.args) {
            hasCorrectArgSig = true;
        }
        else if (msg.args && Array.isArray(msg.args)) {
            hasCorrectArgSig = true;
        }
        else {
            hasCorrectArgSig = false;
        }
        return hasEventSig && hasEventType && hasHighframeFlag && hasCorrectArgSig;
    };
    HighframeMessage.deserialize = function (rawMessage, e) {
        var msg;
        try {
            msg = JSON.parse(rawMessage);
        }
        catch (originalError) {
            throw new errors.SerializationError(undefined, originalError);
        }
        if (HighframeMessage.hasMessageSignature(msg)) {
            return new HighframeMessage(msg.event, msg.args || []);
        }
        // else implementers should no-op
        return undefined;
    };
    return HighframeMessage;
}());
exports.HighframeMessage = HighframeMessage;
//# sourceMappingURL=message.js.map