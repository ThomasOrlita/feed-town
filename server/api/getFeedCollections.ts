import type { Api } from "../api/Api.types.ts";

import { feedCollections } from "../db/models/FeedCollection.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedCollections: Api['getFeedCollections'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    
    const collections = await feedCollections.find({
        owner: userId,
    }, { noCursorTimeout: false }).toArray();

    return collections;
};