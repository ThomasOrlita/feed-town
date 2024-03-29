import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";
import { feedSources } from "../db/models/FeedSource.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const addFeedToCollection: Api['addFeedToCollection'] = async ({ collectionId, feedId }: { collectionId: string; feedId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    const feedCollection = await feedCollections.findOne({
        _id: new ObjectId(collectionId),
        owner: userId
    }, { noCursorTimeout: false });
    if (!feedCollection) {
        throw new Error("Feed collection not found");
    }
    const feed = await feedSources.findOne({
        _id: new ObjectId(feedId),
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error("Feed not found");
    }
    if (feedCollection.public === true && feed.public === false) {
        throw new Error("You cannot add a private feed to a public collection.");
    }

    if (await feedCollections.updateOne({
        _id: new ObjectId(collectionId),
    }, {
        $addToSet: {
            feedSources: {
                $each: [new ObjectId(feedId)],
            },
        },
    })) {
        return {

        };
    }

    throw new Error("Failed to add feed to collection");
};