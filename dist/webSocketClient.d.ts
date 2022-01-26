/// <reference types="node" />
import { EventEmitter } from 'events';
import * as WebSocket from 'ws';
/**
 * WebSocketClient allows to use WebSocket and keep connection alive until manual close.
 * By persistent reconnect  when connection close from any reason.
 */
export declare class WebSocketClient extends EventEmitter {
    private reconnectingIntervalMs;
    private showConsoleLogs;
    /** web socket instance */
    private webSocket;
    /** is connection close manually by code. */
    private manualClosed;
    /** ws server url */
    private wsServerUrl;
    /** ws options */
    private options;
    /**
     * WebSocket instance.
     * Allows to use it for any additional API hat not wrapped in 'WebSocketClient',
     * Note that when trying to reconnect *all* listeners wil be removed.
     */
    get WebSocketInstance(): WebSocket;
    /**
     * Init WebSocketClient with reconnection properties.
     * @param reconnectingIntervalMs Timeout between connection fail to next  trying connection. in milliseconds.
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
     * @param options ws client options (like: {'headers' : {'test': 'heather'}})
     */
    connect(url: string, options: any): void;
    /**
     * Disconnect manually from web socket server.
     */
    disconnect(): void;
    /** Send data to web socket server.  */
    sendData(data: any): void;
}
//# sourceMappingURL=webSocketClient.d.ts.map
