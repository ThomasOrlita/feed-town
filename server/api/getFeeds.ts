import type { Api } from "../api/Api.types.ts";

import { feeds } from "../db/models/Feed.ts";

export const getFeeds: Api['getFeeds'] = async (jwt?: string) => {
    const feedSources = await feeds.find({}, { noCursorTimeout: false }).toArray();

    return feedSources;
};