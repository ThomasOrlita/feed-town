import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";
import { feedSources } from "../db/models/FeedSource.ts";
import { feedItems } from "../db/models/FeedItem.ts";
import { parse } from "./parser/rss.ts";
import { getUrlForFeed } from "./feedUrl.ts";
import type { Feed } from "../api/Api.types.ts";

export const fetchFeedItems = async (feedId: ObjectId) => {
    const feed = await feedSources.findOne({ _id: feedId }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error('Feed not found');
    }

    await feedSources.updateOne({ _id: feedId }, {
        $set: {
            lastChecked: new Date(),
        },
    });

    const parsedFeedItems = await parse(getUrlForFeed(feed.input));

    for (const feedItem of parsedFeedItems) {
        console.log(`Processing feed item: ${feedItem.url}`);

        let content: Feed.Item.Content;

        if (feed.input.type === 'TWITTER_USER_TIMELINE') {
            content = {
                ...feedItem,
                username: feedItem.url.split('/')[3],
                type: feed.input.type
            };
        } else if (feed.input.type === 'REDDIT_SUBREDDIT' || feed.input.type === 'RSS') {
            content = {
                ...feedItem,
                type: feed.input.type
            };
        } else {
            throw new Error(`Feed type ${feed.input.type} is not an RSS feed`);
        }

        // insert the feed item
        // only if it does not already exist
        await feedItems.updateOne({
            'content.url': feedItem.url,
            feedId,
        }, {
            $setOnInsert: {
                feedId,
                comments: [],
                content,
                dateCreated: new Date(),
                likes: [],
                views: [],
            }
        }, { upsert: true });
    }

    return true;
};