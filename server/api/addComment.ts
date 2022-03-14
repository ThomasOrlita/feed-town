import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { feedSources } from "../db/models/FeedSource.ts";

export const addComment: Api['addComment'] = async ({ itemId, comment }: { itemId: string; comment: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedItem = await feedItems.findOne({
        _id: new ObjectId(itemId),
    }, { noCursorTimeout: false });
    if (!feedItem) {
        throw new Error("Feed item not found");
    }

    const feed = await feedSources.findOne({
        _id: feedItem.feedId,
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    const newCommentId = new ObjectId();
    if (await feedItems.updateOne({
        _id: new ObjectId(itemId),
    }, {
        $push: {
            comments: {
                $each: [{
                    _id: newCommentId,
                    content: comment,
                    dateCreated: new Date(),
                    author: userId
                }]
            },
        },
    })) {
        return {
            _id: newCommentId.toHexString(),
        };
    }

    throw new Error("Failed to add comment");
};