import type { Api } from "../api/Api.types.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";

export const getFeedCollections: Api['getFeedCollections'] = async (jwt?: string) => {
    const collections = await feedCollections.find({}, { noCursorTimeout: false }).toArray();

    return collections;
};