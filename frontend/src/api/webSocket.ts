/*const socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = (e) => {
    alert("[open] Connection established");
    alert("Sending to server");
    socket.send("My name is John");
};

socket.onmessage = (event) => {
    alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = (event) => {
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
    }
};

socket.onerror = (error) => {
    alert(`[error] ${error.message}`);
};

export const send = (message: { name: string; data: Object; }) => {
    socket.send();
};


*/
import * as MessagePack from '@msgpack/msgpack';
import { AsyncCall,   } from 'async-call-rpc';
import { WebSocketMessageChannel } from 'async-call-rpc/utils/web/websocket.client';
import { Msgpack_Serialization } from 'async-call-rpc/utils/web/msgpack';

/** @type {typeof import('./node.websocket.server').server} */
// g
const server = AsyncCall(
    {},
    {
        channel: new WebSocketMessageChannel('ws://localhost:3456/'),
        serializer: Msgpack_Serialization(MessagePack),
    },
);

console.log('Server at window.remote', server, 'library at window.ac');