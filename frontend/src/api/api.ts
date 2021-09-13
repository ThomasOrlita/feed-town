import { AsyncCall, } from 'async-call-rpc';
import { WebSocketMessageChannel } from 'async-call-rpc/utils/web/websocket.client';
import type * as Api from '../../../server/api/api';

const server = AsyncCall<typeof Api>(
    {},
    {
        channel: new WebSocketMessageChannel('wss://4000-tomato-parrotfish-7sk3i3iy.ws-eu16.gitpod.io/'),
        serializer: {
            deserialization: (data: string) => JSON.parse(data),
            serialization: (data: any) => JSON.stringify(data)
        },
    },
);

export default server;