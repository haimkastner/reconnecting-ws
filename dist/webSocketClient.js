"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
/**
 * WebSocketClient allows to use WebSocket and keep connection alive untile manual close.
 * By reconnect automatly when connection close from any reasone.
 */
class WebSocketClient extends events_1.EventEmitter {
    /**
     * Init WebSocketClient with reconnection properties.
     * @param reconnectingIntervalMs Timeout between connection fail to next  trying connection. in miliseconds.
     * @param showConsoleLogs Mark if show message in console.
     */
    constructor(reconnectingIntervalMs = 5000, showConsoleLogs = false) {
        super();
        this.reconnectingIntervalMs = reconnectingIntervalMs;
        this.showConsoleLogs = showConsoleLogs;
        /** is connection close manualy by code. */
        this.manualClosed = false;
        /** ws server url */
        this.wsServerUrl = '';
    }
    /**
     * WebSocket instance.
     * Allows to use it for any addionnal API hat not wrapped in 'WebSocketClient',
     * Note that when trying to reconnect *all* listeners removed.
     */
    get WebSocketInstance() {
        return this.webSocket;
    }
    /** On connection open */
    onOpen() {
        if (this.showConsoleLogs) {
            console.log(`sockets successfuly opend`);
        }
        this.emit('open');
    }
    /** On connection closed */
    onClose(code, reason) {
        if (this.showConsoleLogs) {
            console.log(`sockets closed with code ${code} reason: ${reason}`);
        }
        this.emit('close', code, reason);
        /** If connection closed manualy, return. */
        if (this.manualClosed) {
            return;
        }
        /** Try to reconnect */
        this.reconnect();
    }
    /** On connection error */
    onError(err) {
        if (this.showConsoleLogs) {
            console.log(`error with seb socket ${err.message}`);
        }
        /** If connection closed manualy, return. */
        if (this.manualClosed) {
            return;
        }
        /** Close connection, and let reconnect do the magic. */
        this.webSocket.close();
    }
    /** On message arrived from server */
    onMessage(data) {
        this.emit('message', data);
    }
    /** Try to reconnect to web socket server  */
    reconnect() {
        /** Remove all listers (befor creating new instance or re-subscribing emitters)  */
        this.webSocket.removeAllListeners();
        /** Wait reconnectingInterval time */
        setTimeout(() => {
            if (this.showConsoleLogs) {
                console.log(`try to reconnect to seb socket server...`);
            }
            this.emit('reconnect');
            /** Connect agine with same url */
            this.connect(this.wsServerUrl);
        }, this.reconnectingIntervalMs);
    }
    /**
     * Connect to seb socket server.
     * @param url ws server url (like: ws://127.0.0.1)
     */
    connect(url) {
        /** Keep url case needs reconnect */
        this.wsServerUrl = url;
        /** Reset closing mark */
        this.manualClosed = false;
        /** Create new WebSocket instance */
        this.webSocket = new ws_1.default(url);
        /** Subscribe to emitters */
        this.webSocket.on('open', () => { this.onOpen(); });
        this.webSocket.on('error', (err) => { this.onError(err); });
        this.webSocket.on('message', (data) => { this.onMessage(data); });
        this.webSocket.on('close', (code, reason) => { this.onClose(code, reason); });
    }
    /**
     * Disconnect manualy from web socket server.
     */
    disconnect() {
        this.manualClosed = true;
        this.webSocket.close();
    }
    /** Send data to web socket server.  */
    sendData(data) {
        this.webSocket.send(data);
    }
}
exports.WebSocketClient = WebSocketClient;
//# sourceMappingURL=webSocketClient.js.map