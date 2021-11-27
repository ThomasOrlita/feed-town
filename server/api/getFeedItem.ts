import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";

export const getFeedItem: Api['getFeedItem'] = async ({ itemId }: { itemId: string; }, jwt?: string) => {
    const feed = await feedItems.findOne({
        _id: new ObjectId(itemId),
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed item not found");
    }

    return feed;
};