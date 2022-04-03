import { AsyncCall } from 'async-call-rpc';
import type { _AsyncVersionOf } from 'async-call-rpc';
import { WebSocketMessageChannel } from 'async-call-rpc/utils/web/websocket.client';
import type { Api } from '@server/api/Api.types';
import { isConnectionError } from './store';

let serverApi: _AsyncVersionOf<Api>;
let wsChannel: WebSocketMessageChannel;
const startServerConnection = (timeout?: number) => {
    wsChannel = new WebSocketMessageChannel(location.host.includes('8000') ? (location.host.replace('8000', '4000') + ':443') : 'wss://ft-api.h.thomasorlita.com');

    if (timeout) {
        wsChannel.addEventListener('error', () => {
            isConnectionError.set(true);
            setTimeout(() => {
                // exponential backoff
                startServerConnection(timeout * 2);
            }, timeout);
        }, {
            once: true
        });

        wsChannel.addEventListener('open', () => {
            isConnectionError.set(false);
        }, {
            once: true
        });
    }

    serverApi = AsyncCall<Api>(
        {},
        {
            channel: wsChannel,
            serializer: {
                deserialization: (data: string) => JSON.parse(data),
                serialization: (data: any) => JSON.stringify(data)
            },
        },
    );
};

startServerConnection();

// JWT middleware
// token will be added as the last parameter for all API methods
const server = new Proxy(serverApi, {
    get(target, key) {
        if (wsChannel.readyState === wsChannel.CLOSING || wsChannel.readyState === wsChannel.CLOSED) {
            startServerConnection(500);
        }
        return new Proxy(serverApi[key], {
            apply: (target, _, argumentsList) =>
                target(...argumentsList, localStorage.getItem('jwt'))
        });
    },
});

export default server;