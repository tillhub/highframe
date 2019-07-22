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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var environment_1 = require("./environment");
var message_1 = require("./message");
var child_1 = __importDefault(require("./child"));
exports.HighframeChild = child_1.default;
var helpers_1 = require("./helpers");
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (Highframe.debug)
        console.log.apply(console, ['Highframe: '].concat(args));
}
exports.debug = debug;
var defaultEventMap = {
    'onload': {
        name: 'loaded'
    }
};
var HighframeClient = /** @class */ (function (_super) {
    __extends(HighframeClient, _super);
    function HighframeClient(target, options) {
        var _this = _super.call(this) || this;
        _this.initialized = false;
        _this.boundEvents = [];
        _this.options = options;
        _this.target = target;
        _this.bindEvents();
        _this.attach();
        return _this;
    }
    HighframeClient.prototype._emit = function (type) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.options.eventInterceptor) {
            (_a = this.options).eventInterceptor.apply(_a, [type].concat(args));
        }
        this.emit.apply(this, [type].concat(args));
        return true;
    };
    HighframeClient.prototype.sendMessage = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.target.contentWindow)
            throw new Error('Content window was not initialized');
        var msg = new message_1.HighframeMessage(type, args);
        this.target.contentWindow.postMessage(msg.serialize(), this.options.childOrigin);
    };
    HighframeClient.prototype.bindEvents = function () {
        var _this = this;
        Object.entries(HighframeClient.EventMap).forEach(function (evt) {
            var _a;
            var eName = evt[0];
            var map = evt[1];
            var handler = function (e) {
                _this._emit(map.name, e);
            };
            // dynamic HTMLElement props will be marked as readonly unfortunately
            _this.target[eName] = handler;
            _this.boundEvents.push((_a = {}, _a[map.name] = { handler: handler }, _a));
        });
    };
    HighframeClient.prototype.attach = function () {
        var _this = this;
        var handler = function (e) {
            if (!helpers_1.sanitizeMessage(e, { allowedOrigin: _this.options.childOrigin }))
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
    HighframeClient.prototype.handleMessage = function (e) {
        var msg = message_1.HighframeMessage.deserialize(e.data, e);
        if (!msg)
            return;
        this._emit.apply(this, [msg.event].concat(msg.args));
    };
    HighframeClient.environment = environment_1.environment;
    HighframeClient.EventMap = defaultEventMap;
    return HighframeClient;
}(events_1.default.EventEmitter));
exports.HighframeClient = HighframeClient;
var Highframe = /** @class */ (function (_super) {
    __extends(Highframe, _super);
    function Highframe(holder, options) {
        var _this = _super.call(this) || this;
        _this.holder = holder;
        _this.holder = Highframe.removeChildren(_this.holder);
        var target = Highframe.createClientTarget(options.src, options);
        var opts = __assign({}, options, { eventInterceptor: function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _this.handleClientEvent.apply(_this, [type].concat(args));
            } });
        _this.client = new HighframeClient(target, opts);
        Highframe.appendChild(holder, target);
        return _this;
    }
    Highframe.prototype.handleClientEvent = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, [type].concat((args || [])));
    };
    Highframe.prototype.dispatch = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.client.sendMessage(type, args);
        return true;
    };
    Highframe.removeChildren = function (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    };
    Highframe.appendChild = function (holder, target) {
        holder.appendChild(target);
    };
    Highframe.createClientTarget = function (src, _a) {
        var title = _a.title, properties = _a.properties;
        var elem = document.createElement('iframe');
        elem.src = src;
        if (title)
            elem.title = title;
        elem.frameBorder = properties ? properties.frameBorder : '0'; // tslint:disable-line deprecation
        // the following following are opinionated property and style normalisations
        // that one almost always wants. We allow the user to override them
        elem.width = properties && (properties.width || Number.isFinite(properties.width)) ? String(properties.width) : '100%';
        elem.height = properties && (properties.height || Number.isFinite(properties.height)) ? String(properties.height) : '100%';
        elem.allowFullscreen = properties && properties.allowFullscreen ? true : false;
        elem.allowFullscreen = properties && properties.allowPaymentRequest ? true : false;
        // margin: 0;
        // padding: 0;
        // border: 0;
        // font-size: 100%;
        // font: inherit;
        // vertical-align: baseline;
        elem.style.display = 'block';
        elem.style.margin = '0';
        elem.style.padding = '0';
        elem.style.border = '0';
        elem.style.fontSize = '100%';
        elem.style.font = 'inherit';
        elem.style.verticalAlign = 'baseline';
        return elem;
    };
    Highframe.create = function (target, options) {
        var inst = new Highframe(target, options);
        return inst;
    };
    Highframe.debug = false;
    return Highframe;
}(events_1.default));
exports.default = Highframe;
//# sourceMappingURL=highframe.js.map