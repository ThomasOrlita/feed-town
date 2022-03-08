import { Bson } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import { Api } from "../api/Api.types.ts";
import { feeds } from "../db/models/Feed.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { removeFeedFromCollectionPrivate } from "./removeFeedFromCollection.ts";

export const renameFeedSource: Api['renameFeedSource'] = async ({ feedSourceId, title }: { feedSourceId: string; title: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    await feeds.updateOne({
        _id: new Bson.ObjectId(feedSourceId),
        owner: userId
    }, {
        $set: {
            title
        }
    });

    return {};
};

export const deleteFeedSource: Api['deleteFeedSource'] = async ({ feedSourceId }: { feedSourceId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedSource = await feeds.findOne({
        _id: new Bson.ObjectId(feedSourceId),
        owner: userId
    }, { noCursorTimeout: false });

    if (!feedSource) throw new Error("Feed not found");

    // remove this feed from all collections

    const collectionsWithThisFeed = await feedCollections.find({
        feedSources: new Bson.ObjectId(feedSourceId)
    }, { noCursorTimeout: false }).toArray();

    for (const collection of collectionsWithThisFeed) {
        await removeFeedFromCollectionPrivate({
            collectionId: collection._id.toHexString(),
            feedId: feedSourceId
        });
    }

    await feeds.deleteOne({
        _id: new Bson.ObjectId(feedSourceId),
        owner: userId
    });

    return {};
};

export const setFeedSourceAsPublic: Api['setFeedSourceAsPublic'] = async ({ feedSourceId }: { feedSourceId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    await feeds.updateOne({
        _id: new Bson.ObjectId(feedSourceId),
        owner: userId
    }, {
        $set: {
            public: true
        }
    });

    return {};
};