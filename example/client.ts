import { WebSocketClient } from '../webSocketClient';
import WebSocket from 'ws';

class SocketClient {

    private webSocketClient: WebSocketClient;
    constructor() {
        /** 
         * Init WebSocketClient
         * Set trying reconnect when connection lost each 5 seconds, and show console message 
         */
        this.webSocketClient = new WebSocketClient(5000, true);

        /** Subscribe to emitters. */
        this.webSocketClient.on('open', this.onOpen);
        this.webSocketClient.on('error', this.onError);
        this.webSocketClient.on('message', this.onMessage);
        this.webSocketClient.on('close', this.onClose);
        this.webSocketClient.on('reconnect', this.onReconnect);

        /** Connect to server. */
        this.webSocketClient.connect('ws://127.0.0.1:8080');

        /** 
         * It`s possible to access WebSocket instance directly.
         * without using wrapper of WebSocketClient. (see https://github.com/websockets/ws).
         * Note that when trying to reconnect *all* listeners removed
         */
        const bufferAmout = this.webSocketClient.WebSocketInstance.bufferedAmount;

        /** Disconnect manualy in minute. */
        setTimeout(() => {
            this.webSocketClient.disconnect();
        }, 60000);
    }

    private onOpen() {
        console.log('onOpen');
    }

    private onClose(code: number, reason: string) {
        console.log('onClose');

    }

    private onError(err: Error) {
        console.log('onError');

    }

    private onMessage(data: WebSocket.Data) {
        console.log('onMessage');

    }

    private onReconnect() {
        console.log('onReconnect');

    }
}

export const socketClient = new SocketClient();

/** Keep app alive forever */
setTimeout(() => { }, 60000000);