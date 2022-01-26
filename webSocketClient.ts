import { EventEmitter } from 'events';
import * as WebSocket from 'ws';

/**
 * WebSocketClient allows to use WebSocket and keep connection alive until manual close.
 * By persistent reconnect  when connection close from any reason.
 */
export class WebSocketClient extends EventEmitter {

    /** web socket instance */
    private webSocket!: WebSocket;
    /** is connection close manually by code. */
    private manualClosed = false;
    /** ws server url */
    private wsServerUrl = '';
    /** ws options */
    private options = {};
    /**
     * WebSocket instance.
     * Allows to use it for any additional API hat not wrapped in 'WebSocketClient',
     * Note that when trying to reconnect *all* listeners wil be removed.
     */
    public get WebSocketInstance(): WebSocket {
        return this.webSocket;
    }

    /**
     * Init WebSocketClient with reconnection properties.
     * @param reconnectingIntervalMs Timeout between connection fail to next  trying connection. in milliseconds.
     * @param showConsoleLogs Mark if show message in console.
     */
    constructor(private reconnectingIntervalMs: number = 5000, private showConsoleLogs = false) {
        super();
    }

    /** On connection open */
    private onOpen() {
        if (this.showConsoleLogs) {
            console.log(`sockets successfully opened`);
        }
        this.emit('open');
    }

    /** On connection closed */
    private onClose(code: number, reason: string) {
        if (this.showConsoleLogs) {
            console.log(`sockets closed with code ${code} reason: ${reason}`);
        }
        this.emit('close', code, reason);

        /** If connection closed manually, return. */
        if (this.manualClosed) {
            return;
        }
        /** Try to reconnect */
        this.reconnect();
    }

    /** On connection error */
    private onError(err: Error) {
        if (this.showConsoleLogs) {
            console.log(`error with web-socket ${err.message}`);
        }
        /** If connection closed manually, return. */
        if (this.manualClosed) {
            return;
        }
        /** Close connection, and let reconnect do the magic. */
        this.webSocket.close();
    }

    /** On message arrived from server */
    private onMessage(data: WebSocket.Data) {
        this.emit('message', data);
    }

    /** Try to reconnect to web socket server  */
    private reconnect() {
        /** Remove all listers (before creating new instance or re-subscribing emitters)  */
        this.webSocket.removeAllListeners();

        /** Wait reconnectingInterval time */
        setTimeout(() => {
            /** If connection closed manually, and the timeout already in queue abort re-connecting. */
            if (this.manualClosed) {
                return;
            }
            if (this.showConsoleLogs) {
                console.log(`try to reconnect to the web-socket server...`);
            }
            this.emit('reconnect');
            /** Connect again with the same url */
            this.connect(this.wsServerUrl,this.options);
        }, this.reconnectingIntervalMs);
    }

    /**
     * Connect to seb socket server.
     * @param url ws server url (like: ws://127.0.0.1)
     * @param options ws client options (like: {'headers' : {'X-auth': 'token'}})
     */
    public connect(url: string, options: any) {
        /** Keep url case needs reconnect */
        this.wsServerUrl = url;
        /** Reset closing mark */
        this.manualClosed = false;
        /** add any extra connection options */
        this.options = options;

        /** Create a new WebSocket instance */
        this.webSocket = new WebSocket(url,options);

        /** Subscribe to emitters */
        this.webSocket.on('open', () => { this.onOpen(); });
        this.webSocket.on('error', (err: Error) => { this.onError(err); });
        this.webSocket.on('message', (data: WebSocket.Data) => { this.onMessage(data); });
        this.webSocket.on('close', (code: number, reason: string) => { this.onClose(code, reason); });
    }

    /**
     * Disconnect manually from web socket server.
     */
    public disconnect() {
        this.manualClosed = true;
        this.webSocket.close();
    }

    /** Send data to web socket server.  */
    public sendData(data: any) {
        this.webSocket.send(data);
    }
}
