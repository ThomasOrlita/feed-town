import type { Api } from "../api/Api.types.ts";

import { feedSources } from "../db/models/FeedSource.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const getFeedSources: Api['getFeedSources'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    return await feedSources.find({
        owner: userId,
    }, { noCursorTimeout: false }).toArray();
};