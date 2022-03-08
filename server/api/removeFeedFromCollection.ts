import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";
import { feeds } from "../db/models/Feed.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const removeFeedFromCollectionPrivate = async ({ collectionId, feedId }: { collectionId: string; feedId: string; }) => {
    return await feedCollections.updateOne({
        _id: new ObjectId(collectionId),
    }, {
        $pull: {
            feedSources: new ObjectId(feedId),
        },
    });
};

export const removeFeedFromCollection: Api['removeFeedFromCollection'] = async ({ collectionId, feedId }: { collectionId: string; feedId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedCollection = await feedCollections.findOne({
        _id: new ObjectId(collectionId),
        owner: userId
    }, { noCursorTimeout: false });
    if (!feedCollection) {
        throw new Error("Feed collection not found");
    }
    const feed = await feeds.findOne({
        _id: new ObjectId(feedId),
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }

    if (await removeFeedFromCollectionPrivate({ collectionId, feedId })) {
        return {};
    }
    throw new Error("Failed to remove feed from collection");
};