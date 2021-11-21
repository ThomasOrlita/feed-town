import * as api from './api/api.ts';

import { serve } from 'https://deno.land/std@0.61.0/http/server.ts';
import { AsyncCall } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.1/out/base.mjs';
import { WebSocketChannel } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.1/utils/deno/websocket.server.ts';


try {
    const port = 4000;
    AsyncCall(api, {
        channel: new WebSocketChannel(serve({ port })),
        serializer: {
            deserialization: (data: string) => JSON.parse(data),
            serialization: (data: any) => JSON.stringify(data, (_key, value) => {
                if (typeof value.toHexString === "function") {
                    return value.toHexString();
                }
                return value;
            })
        },
        log: { type: 'basic' },
    });
    console.info('Server is running on :' + port);
} catch (e) {
    console.error(e);
}