import type { Account, Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feeds } from "../db/models/Feed.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { users } from "../db/models/User.ts";

export const getFeedItem: Api['getFeedItem'] = async ({ itemId }: { itemId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    const feedItem = await feedItems.findOne({
        _id: new ObjectId(itemId),
    }, { noCursorTimeout: false });
    if (!feedItem) {
        throw new Error("Feed item not found");
    }

    const feed = await feeds.findOne({
        _id: feedItem.feedId,
        owner: userId
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    const comments = await Promise.all(feedItem.comments.map(async (comment) => {
        const user = (await users.findOne({
            _id: comment.author,
        }, { noCursorTimeout: false }) as Account.User);

        return {
            ...comment,
            authorInfo: {
                _id: user?._id,
                username: user?.username as string,
                avatarUrl: user?.avatarUrl as string,
            }
        };
    }
    ));

    return {
        feed,
        item: feedItem,
        commentsPopulated: comments
    };
};