import { EventEmitter } from 'events';
import  WebSocket from 'ws';

/**
 * WebSocketClient allows to use WebSocket and keep connection alive untile manual close.
 * By reconnect automatly when connection close from any reasone.
 */
export class WebSocketClient extends EventEmitter {

    /** web socket instance */
    private webSocket!: WebSocket;
    /** is connection close manualy by code. */
    private manualClosed = false;
    /** ws server url */
    private wsServerUrl = '';

    /**
     * WebSocket instance.
     * Allows to use it for any addionnal API hat not wrapped in 'WebSocketClient',
     * Note that when trying to reconnect *all* listeners removed.
     */
    public get WebSocketInstance(): WebSocket {
        return this.webSocket;
    }

    /**
     * Init WebSocketClient with reconnection properties.
     * @param reconnectingIntervalMs Timeout between connection fail to next  trying connection. in miliseconds.
     * @param showConsoleLogs Mark if show message in console.
     */
    constructor(private reconnectingIntervalMs: number = 5000, private showConsoleLogs = false) {
        super();
    }

    /** On connection open */
    private onOpen() {
        if (this.showConsoleLogs) {
            console.log(`sockets successfuly opend`);
        }
        this.emit('open');
    }

    /** On connection closed */
    private onClose(code: number, reason: string) {
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
    private onError(err: Error) {
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
    private onMessage(data: WebSocket.Data) {
        this.emit('message', data);
    }

    /** Try to reconnect to web socket server  */
    private reconnect() {
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
    public connect(url: string) {
        /** Keep url case needs reconnect */
        this.wsServerUrl = url;
        /** Reset closing mark */
        this.manualClosed = false;

        /** Create new WebSocket instance */
        this.webSocket = new WebSocket(url);

        /** Subscribe to emitters */
        this.webSocket.on('open', () => { this.onOpen(); });
        this.webSocket.on('error', (err: Error) => { this.onError(err); });
        this.webSocket.on('message', (data: WebSocket.Data) => { this.onMessage(data); });
        this.webSocket.on('close', (code: number, reason: string) => { this.onClose(code, reason); });
    }

    /**
     * Disconnect manualy from web socket server.
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
