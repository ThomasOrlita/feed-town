import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import type { Api, Feed } from "../api/Api.types.ts";
import { feeds } from "../db/models/Feed.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedCollectionsWithFeedSources: Api['getFeedCollectionsWithFeedSources'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const collections = await feedCollections.find({
        owner: userId
    }, { noCursorTimeout: false }).toArray();

    const collectionsWithFeeds: Feed.Collection.FeedCollectionWithFeedSources[] = [];

    for (const collection of collections) {

        const feedSources: Feed.Source.FeedSource[] = [];

        for (const feedId of collection.feedSources) {
            const feed = await feeds.findOne({
                _id: new ObjectId(feedId),
                owner: userId
            }, { noCursorTimeout: false });
            if (!feed) {
                throw new Error(`Feed ${feedId} not found`);
            }
            feedSources.push(feed);
        }

        collectionsWithFeeds.push({
            ...collection,
            feedSources,
        });
    }

    return collectionsWithFeeds;
};