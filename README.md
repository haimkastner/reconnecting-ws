# reconnecting-ws
Wrap WS client to auto reconnect websocket server when disconnected by any reason.

The code is based on https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect


## Installing

```
npm install --save reconnecting-ws
```

## Using

```typescript
import { WebSocketClient } from 'reconnecting-ws';


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
        this.webSocketClient.connect('ws://127.0.0.1:3001');

        /** 
         * It`s possible to access WebSocket instance directly.
         * without using wrapper of WebSocketClient. (see https://github.com/websockets/ws).
         * Note that when trying to reconnect *all* listeners will be removed
         */
        const bufferAmount = this.webSocketClient.WebSocketInstance.bufferedAmount;

        /** Disconnect manually in minute. */
        setTimeout(() => {
            this.webSocketClient.disconnect();
        }, 60000);
    }

    private onOpen() {
        // TODO
        console.log('onOpen');
    }

    private onClose(code: number, reason: string) {
        // TODO
        console.log('onClose');
    }

    private onError(err: Error) {
        // TODO
        console.log('onError');
    }

    private onMessage(data: WebSocket.Data) {
        // TODO
        console.log('onMessage');

    }

    private onReconnect() {
        // TODO
        console.log('onReconnect');

    }
}
```

For real example see `example` folder.

