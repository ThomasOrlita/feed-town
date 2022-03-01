import { Bson } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import { Api } from "../api/Api.types.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { removeFeedFromCollection } from "./removeFeedFromCollection.ts";

export const renameFeedCollection: Api['renameFeedCollection'] = async ({ feedCollectionId, title }: { feedCollectionId: string; title: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    await feedCollections.updateOne({
        _id: new Bson.ObjectId(feedCollectionId),
        owner: userId
    }, {
        $set: {
            title
        }
    });

    return {};
};

export const deleteFeedCollection: Api['deleteFeedCollection'] = async ({ feedCollectionId }: { feedCollectionId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    // remove feed sources from this collection
    const feedCollection = await feedCollections.findOne({
        _id: new Bson.ObjectId(feedCollectionId),
        owner: userId
    }, { noCursorTimeout: false });

    if (!feedCollection) throw new Error("Feed collection not found");

    for (const feedSourceId of feedCollection?.feedSources ?? []) {
        await removeFeedFromCollection({
            collectionId: feedCollectionId,
            feedId: feedSourceId.toHexString()
        }, jwt);
    }

    await feedCollections.deleteOne({
        _id: new Bson.ObjectId(feedCollectionId),
        owner: userId
    });

    return {};
};