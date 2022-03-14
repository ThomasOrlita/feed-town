import { feedSources } from "../db/models/FeedSource.ts";
import { feedCollections } from "../db/models/FeedCollection.ts";
import { aggregateFeedItems } from "../feed/aggregateFeedItems.ts";
import { Api } from "./Api.types.ts";
import { getUserIdFromJwtToken } from "./auth.ts";
import { fetchFeedItems } from "../feed/fetchFeedItems.ts";

export const getHomeFeed: Api['getHomeFeed'] = async (jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    const collectionsFeedSourceIds = (await feedCollections.find({
        owner: userId,
    }, { noCursorTimeout: false }).toArray()).flatMap(c => c.feedSources);

    const feedSourceIds = (await feedSources.find({
        owner: userId,
    }, { noCursorTimeout: false }).toArray()).map(f => f._id);

    const feedSourceIdsToAggregate = [...collectionsFeedSourceIds, ...feedSourceIds];

    for (const feedSourceId of feedSourceIdsToAggregate) {
        try {
            fetchFeedItems(feedSourceId);
        } catch { }
    }

    const items = await aggregateFeedItems(userId, { $in: feedSourceIdsToAggregate });

    return items;
};