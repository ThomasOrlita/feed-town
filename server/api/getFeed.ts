import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feeds } from "../db/models/Feed.ts";

export const getFeed: Api['getFeed'] = async ({ feedId }: { feedId: string; }, jwt?: string) => {
    const feed = await feeds.findOne({
        _id: new ObjectId(feedId),
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    const items = await feedItems.find({
        feedId: new ObjectId(feedId),
    }, { noCursorTimeout: false }).toArray();

    return {
        feed,
        items
    };
};