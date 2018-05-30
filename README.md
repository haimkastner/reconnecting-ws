# reconnecting-ws
Wrap WS to try reconnect websocket server when disconnect by any reasone

The code is based on https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect


## Installing

```
npm install --save reconnecting-ws
```

## Sample use

```js
const webSocket = require('reconnecting-ws');
var socket = new webSocket(6000); // set intaerval to 6000 ms insted of 5000 default

socket.open("wss://127.0.0.1/ws-api");

socket.onopen = () => {
    console.log('WS open')
}

socket.onmessage = e => {
    console.log('WS message')
}

socket.onerror = e => {
    console.log('WS error')
}

socket.onclose = e => {
    console.log('WS close')
}

socket.onreconnect = e => {
    console.log('WS reconecting...')
}

// Get the WS instance (see ws API https://github.com/websockets/ws)
var wsInstance = socket.instance; 

// Close connection after 10 seconds
setTimeout(() => {
    wsInstance.close();
}, 10 * 1000)
```
