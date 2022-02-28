import type { Api } from "../api/Api.types.ts";

import { feeds } from "../db/models/Feed.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeeds: Api['getFeeds'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    const feedSources = await feeds.find({
        owner: userId,
    }, { noCursorTimeout: false }).toArray();

    return feedSources;
};