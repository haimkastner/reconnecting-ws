const WebSocket = require('ws');

/* 
The handler for WS to reconnect etc.
*/
function WebSocketClient() {
    this.autoReconnectInterval = 5 * 1000;	// ms
}

/*
Open a WS channel connecion by given URL
*/
WebSocketClient.prototype.open = function (url) {
    this.url = url; // Keep URL for next reconnecting

    this.instance = new WebSocket(this.url); // Create a WS instance

    this.instance.on('open', () => {
        this.onopen();
    });

    this.instance.on('message', (data, flags) => {
        this.onmessage(data, flags);
    });

    this.instance.on('close', (code) => {
        switch (code) {
            case 1000:	// CLOSE_NORMAL
                break;
            default:	// Abnormal closure
                this.reconnect(code);
                break;
        }
        this.onclose(code);
    });

    this.instance.on('error', (e) => {
        this.reconnect(e);
        this.onerror(e);
    });
}

/*
Send any valid data by WS channel
*/
WebSocketClient.prototype.send = function (data, option) {
    try {
        this.instance.send(data, option);
    } catch (e) {
        this.instance.emit('error', e);
    }
}

/*
Close all open listeners and try reconnect
*/
WebSocketClient.prototype.reconnect = function (e) {
    this.instance.removeAllListeners();
    var that = this;
    setTimeout(function () {
        that.onrecconect();
        that.open(that.url);
    }, this.autoReconnectInterval);
}

WebSocketClient.prototype.onopen = function (e) { console.log("WebSocketClient: open", arguments); }
WebSocketClient.prototype.onmessage = function (data, flags, number) { console.log("WebSocketClient: message", arguments); }
WebSocketClient.prototype.onerror = function (e) { console.log("WebSocketClient: error", arguments); }
WebSocketClient.prototype.onclose = function (e) { console.log("WebSocketClient: closed", arguments); }
WebSocketClient.prototype.onrecconect = function (e) { console.log("WebSocketClient: reconnect...", arguments); }

module.exports = WebSocketClient;