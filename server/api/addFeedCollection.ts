import { Api } from "../api/Api.types.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const addFeedCollection: Api['addFeedCollection'] = async ({ title }: { title: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const feedCollectionId = await feedCollections.insertOne({
        title,
        dateCreated: new Date(),
        feedSources: [],
        owner: userId,
        public: false,
    });

    return {
        _id: feedCollectionId.toHexString(),
    };
};