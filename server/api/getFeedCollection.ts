import type { Api, Feed } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feedSources } from "../db/models/FeedSource.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { fetchFeedItems } from "../feed/fetchFeedItems.ts";

export const getFeedCollection: Api['getFeedCollection'] = async ({ feedCollectionId }: { feedCollectionId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedCollection = await feedCollections.findOne({
        _id: new ObjectId(feedCollectionId),
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feedCollection) {
        throw new Error("Feed collection not found");
    }

    const feedSourcesList: Feed.Source.FeedSource[] = [];

    for (const feedId of feedCollection.feedSources) {
        const feed = await feedSources.findOne({
            _id: new ObjectId(feedId),
            $or: [{ owner: userId }, { public: true }],
        }, { noCursorTimeout: false });
        if (!feed) {
            throw new Error(`Feed ${feedId} not found`);
        }
        feedSourcesList.push(feed);
        try {
            fetchFeedItems(feed._id);
        } catch { }
    }

    return {
        ...feedCollection,
        feedSources: feedSourcesList
    };
};