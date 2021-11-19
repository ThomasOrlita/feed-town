import { AsyncCall, } from 'async-call-rpc';
import { WebSocketMessageChannel } from 'async-call-rpc/utils/web/websocket.client';
import type { Api } from '../../../server/api/Api.types';


const server = AsyncCall<Api>(
    {},
    {
        channel: new WebSocketMessageChannel('wss://' + location.hostname.replace('8000', '4000') + ':443'),
        serializer: {
            deserialization: (data: string) => JSON.parse(data),
            serialization: (data: any) => JSON.stringify(data)
        },
    },
);

export default server;