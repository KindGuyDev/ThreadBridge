"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadBridge = void 0;
class ThreadBridge {
    constructor(worker) {
        this._onSourceMessage = (event) => {
            const { type, data } = event.data;
            const handler = this._handlers.get(type);
            if (handler)
                handler(data);
        };
        this._source = worker;
        this._handlers = new Map();
        this._source.onmessage = this._onSourceMessage;
    }
    postMessage(name, args) {
        this._source.postMessage({
            type: name,
            data: args,
        });
    }
    onMessage(name, handler) {
        this._handlers.set(name, handler);
    }
    clearHandler(name) {
        this._handlers.delete(name);
    }
    clearAllHandlers() {
        this._handlers.clear();
    }
}
exports.ThreadBridge = ThreadBridge;
