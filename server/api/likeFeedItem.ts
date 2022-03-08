import type { Account, Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feeds } from "../db/models/Feed.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const likeFeedItem: Api['likeFeedItem'] = async ({ itemId, liked }: { itemId: string; liked: boolean; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedItem = await feedItems.findOne({
        _id: new ObjectId(itemId),
    }, { noCursorTimeout: false });
    if (!feedItem) {
        throw new Error("Feed item not found");
    }

    const feed = await feeds.findOne({
        _id: feedItem.feedId,
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    await feedItems.updateOne({
        _id: new ObjectId(itemId),
        feedId: feed._id,
    }, {
        [liked ? '$addToSet' : '$pull']: {
            likes: userId
        }
    });

    return {};
};