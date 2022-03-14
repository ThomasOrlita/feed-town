import type { Api, Feed } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feedSources } from "../db/models/FeedSource.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { aggregateFeedItems } from "../feed/aggregateFeedItems.ts";
import { fetchFeedItems } from "../feed/fetchFeedItems.ts";

export const getFeed: Api['getFeed'] = async ({ feedSourceId }: { feedSourceId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    const feed = await feedSources.findOne({
        _id: new ObjectId(feedSourceId),
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    const items = await aggregateFeedItems(userId, new ObjectId(feedSourceId));

    fetchFeedItems(feed._id).catch(console.error);

    return {
        feed,
        items
    };
};