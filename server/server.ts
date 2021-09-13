import * as api from './api/api.ts';

import { serve } from 'https://deno.land/std@0.106.0/http/server.ts';
// import { WebSocketChannel } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.0/utils/deno/websocket.server.ts';
import { AsyncCall } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.0/out/base.mjs';

import { Server } from 'https://deno.land/std@0.106.0/http/server.ts';
import { acceptWebSocket, WebSocket } from 'https://deno.land/std@0.106.0/ws/mod.ts';
import { CallbackBasedChannel } from 'https://cdn.jsdelivr.net/npm/async-call-rpc@6.0.0/src/types.ts';

export class WebSocketChannel extends EventTarget implements CallbackBasedChannel {
    constructor(public server: Server) {
        super();
    }
    private async acceptRequest(callback: (data: unknown) => Promise<unknown>, signal: AbortController) {
        for await (const req of this.server) {
            if (signal.signal.aborted) return;
            const { conn, r: bufReader, w: bufWriter, headers } = req;
            const ws = await acceptWebSocket({
                conn,
                bufReader,
                bufWriter,
                headers,
            });
            signal.signal.addEventListener('abort', () => ws.close(), { once: true });
            this.handledWebSocket(ws, callback, signal).catch(this.error);
        }
    }
    private async handledWebSocket(
        websocket: WebSocket,
        callback: (data: unknown) => Promise<unknown>,
        signal: AbortController,
    ) {
        for await (const event of websocket) {
            if (signal.signal.aborted) return;
            if (websocket.isClosed) return;
            callback(event).then((x) => x && websocket.send(x as any), this.error);
        }
    }
    private error = (error: any) => {
        this.dispatchEvent(new ErrorEvent('error', { error }));
    };
    setup(callback: (data: unknown) => Promise<unknown>) {
        const signal = new AbortController();
        this.acceptRequest(callback, signal).catch(this.error);
        return () => signal.abort();
    }
}

import * as rss from './feed/parser/rss.ts';
import {
    DublinCore,
    MediaRss,
    parseFeed,
} from "https://deno.land/x/rss@0.5.3/mod.ts";

{

    const response = await fetch(
        "https://websec.blog/feed",
    );
    const xml = await response.text();

    // Optional destructuring assignment
    const { entries } = await parseFeed(xml);

    // Access fields using the DublinCore and MediaRss enums
    const dcTitle = entries[0][DublinCore.Title];
    const mediaContent = entries[0][MediaRss.Content];

    console.log(entries);

}


try {

    AsyncCall(api, {
        channel: new WebSocketChannel(serve({ port: 4000 })),
        serializer: {
            deserialization: (data: string) => JSON.parse(data),
            serialization: (data: any) => JSON.stringify(data)
        },
        log: { type: 'basic' },
    });
    console.info('Server is running');
} catch (e) {
    console.log('error!');
    console.error(e);
}