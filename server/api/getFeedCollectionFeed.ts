import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedCollectionFeed: Api['getFeedCollectionFeed'] = async ({ feedCollectionId }: { feedCollectionId: string; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    
    const feedCollection = await feedCollections.findOne({
        _id: new ObjectId(feedCollectionId),
        owner: userId
    }, { noCursorTimeout: false });
    if (!feedCollection) {
        throw new Error("Feed collection not found");
    }

    const items = await feedItems.find({
        feedId: { $in: feedCollection.feedSources },
    }, { noCursorTimeout: false }).toArray();
    return items;
};