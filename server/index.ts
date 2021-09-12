/*
import { AsyncCall } from 'https://deno.land/x/async_call_rpc@v4.0.0';
import * as api from './api';


// create a server
AsyncCall(api, { channel });



import { serve } from 'https://deno.land/std@0.61.0/http/server.ts';
import * as MessagePack from 'https://jspm.dev/@msgpack/msgpack';
import { Msgpack_Serialization } from '../utils/web/msgpack.js';
import { WebSocketChannel } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.0/utils/deno/websocket.server.ts';
import { AsyncCall } from '../out/base.mjs';

export const server = {
    now: Date.now,
    rand: Math.random,
    echo: <T>(x: T) => x,
};

AsyncCall(server, {
    channel: new WebSocketChannel(serve({ port: 3456 })),
    serializer: Msgpack_Serialization(MessagePack),
    log: { type: 'basic' },
});
console.log('Server is ready');
*/