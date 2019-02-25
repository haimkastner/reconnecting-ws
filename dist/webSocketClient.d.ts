/// <reference types="node" />
import WebSocket from 'ws';
import { EventEmitter } from 'events';
/**
 * WebSocketClient allows to use WebSocket and keep connection alive untile manual close.
 * By reconnect automatly when connection close from any reasone.
 */
export declare class WebSocketClient extends EventEmitter {
    private reconnectingIntervalMs;
    private showConsoleLogs;
    /** web socket instance */
    private webSocket;
    /** is connection close manualy by code. */
    private manualClosed;
    /** ws server url */
    private wsServerUrl;
    /**
     * WebSocket instance.
     * Allows to use it for any addionnal API hat not wrapped in 'WebSocketClient',
     * Note that when trying to reconnect *all* listeners removed.
     */
    readonly WebSocketInstance: WebSocket;
    /**
     * Init WebSocketClient with reconnection properties.
     * @param reconnectingIntervalMs Timeout between connection fail to next  trying connection. in miliseconds.
     * @param showConsoleLogs Mark if show message in console.
     */
    constructor(reconnectingIntervalMs?: number, showConsoleLogs?: boolean);
    /** On connection open */
    private onOpen;
    /** On connection closed */
    private onClose;
    /** On connection error */
    private onError;
    /** On message arrived from server */
    private onMessage;
    /** Try to reconnect to web socket server  */
    private reconnect;
    /**
     * Connect to seb socket server.
     * @param url ws server url (like: ws://127.0.0.1)
     */
    connect(url: string): void;
    /**
     * Disconnect manualy from web socket server.
     */
    disconnect(): void;
    /** Send data to web socket server.  */
    sendData(data: any): void;
}
//# sourceMappingURL=webSocketClient.d.ts.map