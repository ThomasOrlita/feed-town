import { Api } from "../api/Api.types.ts";
import { feedSources } from "../db/models/FeedSource.ts";
import { fetchFeedItems } from "../feed/fetchFeedItems.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/deps.ts";

export const refreshFeedSource: Api['refreshFeedSource'] = async ({ feedSourceId, force }: { feedSourceId: string; force: boolean; }, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);
    const feedSource = await feedSources.findOne({
        _id: new ObjectId(feedSourceId),
        $or: [{ owner: userId }, { public: true }],
    }, { noCursorTimeout: false });
    if (!feedSource) {
        throw new Error("Feed not found");
    }

    const MINUTE = 60 * 1000;
    const HOUR = 60 * MINUTE;
    const nextCheckLimit = force ? (1 * MINUTE) : (8 * HOUR);

    if (feedSource.lastChecked && (feedSource.lastChecked.getTime() + nextCheckLimit) > Date.now()) return false;

    await fetchFeedItems(feedSource._id);

    return true;
};