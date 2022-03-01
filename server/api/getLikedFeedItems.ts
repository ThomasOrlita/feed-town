import type { Api } from "../api/Api.types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";

import { feedItems } from "../db/models/FeedItem.ts";
import { feeds } from "../db/models/Feed.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getLikedFeedItems: Api['getLikedFeedItems'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const items = await feedItems.find({
        likes: userId,
    }, { noCursorTimeout: false }).toArray();

    return items;
};