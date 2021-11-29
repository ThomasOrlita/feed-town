import { Api } from "../api/Api.types.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";

export const addFeedCollection: Api['addFeedCollection'] = async ({ title }: { title: string; }, jwt?: string) => {

    const feedCollectionId = await feedCollections.insertOne({
        title,
        dateCreated: new Date(),
        feedSources: [],
    });

    return {
        _id: feedCollectionId.toHexString(),
    };
};