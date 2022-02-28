import type { Api, Feed } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feeds } from "../db/models/Feed.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedCollection: Api['getFeedCollection'] = async ({ feedCollectionId }: { feedCollectionId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedCollection = await feedCollections.findOne({
        _id: new ObjectId(feedCollectionId),
        owner: userId
    }, { noCursorTimeout: false });
    if (!feedCollection) {
        throw new Error("Feed collection not found");
    }

    const feedSources: Feed.Source.FeedSource[] = [];

    for (const feedId of feedCollection.feedSources) {
        const feed = await feeds.findOne({
            _id: new ObjectId(feedId),
            owner: userId
        }, { noCursorTimeout: false });
        if (!feed) {
            throw new Error(`Feed ${feedId} not found`);
        }
        feedSources.push(feed);
    }

    return {
        ...feedCollection,
        feedSources
    };
};