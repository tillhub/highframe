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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var message_1 = require("./message");
var helpers_1 = require("./helpers");
var HighframeChild = /** @class */ (function (_super) {
    __extends(HighframeChild, _super);
    function HighframeChild(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.attach();
        _this.ready();
        return _this;
    }
    HighframeChild.prototype.attach = function () {
        var _this = this;
        var handler = function (e) {
            if (!helpers_1.sanitizeMessage(e, { allowedOrigin: _this.options.parentOrigin }))
                return;
            _this.handleMessage(e);
        };
        if (this.handler) {
            // REVIEW: review this cast
            window.removeEventListener('message', this.handler);
        }
        this.handler = handler;
        window.addEventListener('message', handler);
    };
    HighframeChild.prototype.handleMessage = function (e) {
        var msg = message_1.HighframeMessage.deserialize(e.data, e);
        if (!msg)
            return;
        this.emit.apply(this, [msg.event].concat(msg.args));
    };
    HighframeChild.prototype.ready = function () {
        this._emit('ready');
    };
    HighframeChild.prototype._emit = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!parent)
            throw new Error('Parent frame is not available');
        var msg = new message_1.HighframeMessage(type, args);
        parent.postMessage(msg.serialize(), this.options.parentOrigin);
        return true;
    };
    return HighframeChild;
}(events_1.default));
exports.default = HighframeChild;
//# sourceMappingURL=child.js.map