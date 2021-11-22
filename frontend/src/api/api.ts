import { AsyncCall, } from 'async-call-rpc';
import { WebSocketMessageChannel } from 'async-call-rpc/utils/web/websocket.client';
import type { Api } from '../../../server/api/Api.types';

const serverApi = AsyncCall<Api>(
    {},
    {
        channel: new WebSocketMessageChannel('wss://' + location.hostname.replace('8000', '4000') + ':443'),
        serializer: {
            deserialization: (data: string) => JSON.parse(data),
            serialization: (data: any) => JSON.stringify(data)
        },
    },
);

// JWT middleware
// token will be added as the last parameter for all API methods
const server = new Proxy(serverApi, {
    get(target, key) {
        return new Proxy(target[key], {
            apply: (target, _, argumentsList) =>
                target(...argumentsList, 'jwt_will_be_here')
        });
    },
});

export default server;