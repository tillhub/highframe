"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SerializationError = /** @class */ (function (_super) {
    __extends(SerializationError, _super);
    function SerializationError(message, originalError) {
        if (message === void 0) { message = 'Could not serialize message'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'SerializationError';
        _this.originalError = originalError;
        _this.stack = new Error().stack;
        return _this;
    }
    SerializationError.code = 'SERIALIZATION_ERROR';
    return SerializationError;
}(Error));
exports.SerializationError = SerializationError;
var DeserializationError = /** @class */ (function (_super) {
    __extends(DeserializationError, _super);
    function DeserializationError(message, originalError) {
        if (message === void 0) { message = 'Could not deserialize message'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'DeserializationError';
        _this.stack = new Error().stack;
        return _this;
    }
    DeserializationError.code = 'DESERIALIZATION_ERROR';
    return DeserializationError;
}(Error));
exports.DeserializationError = DeserializationError;
//# sourceMappingURL=errors.js.map