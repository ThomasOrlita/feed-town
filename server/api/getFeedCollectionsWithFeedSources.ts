import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import type { Api, Feed } from "../api/Api.types.ts";
import { feedSources } from "../db/models/FeedSource.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedCollectionsWithFeedSources: Api['getFeedCollectionsWithFeedSources'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const collections = await feedCollections.find({
        owner: userId
    }, { noCursorTimeout: false }).toArray();

    const collectionsWithFeeds: Feed.Collection.FeedCollectionWithFeedSources[] = [];

    for (const collection of collections) {

        const feedSourcesList: Feed.Source.FeedSource[] = [];

        for (const feedId of collection.feedSources) {
            const feed = await feedSources.findOne({
                _id: new ObjectId(feedId),
                $or: [{ owner: userId }, { public: true }],
            }, { noCursorTimeout: false });
            if (!feed) {
                throw new Error(`Feed ${feedId} not found`);
            }
            feedSourcesList.push(feed);
        }

        collectionsWithFeeds.push({
            ...collection,
            feedSources: feedSourcesList,
        });
    }

    return collectionsWithFeeds;
};