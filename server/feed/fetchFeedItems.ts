import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/bson/mod.ts";
import { feeds } from "../db/models/Feed.ts";
import { feedItems } from "../db/models/FeedItem.ts";
import { parse } from "./parser/rss.ts";
import { getUrlForFeed } from "./feedUrl.ts";
import type { Feed } from "../api/Api.types.ts";

export const fetchFeedItems = async (feedId: ObjectId) => {
    const feed = await feeds.findOne({ _id: feedId }, { noCursorTimeout: false });
    if (!feed) {
        throw new Error('Feed not found');
    }

    const parsedFeedItems = await parse(getUrlForFeed(feed.input));

    for (const feedItem of parsedFeedItems) {

        // check if feed item already in db
        // and insert it if it's not
        const existingFeedItem = await feedItems.findOne({
            content: {
                url: feedItem.url,
            },
            feed: feedId,
        }, { noCursorTimeout: false });
        if (!existingFeedItem) {
            console.log(`Inserting new feed item: ${feedItem.url}`);

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

            await feedItems.insertOne({
                feedId,
                comments: [],
                content,
                dateCreated: new Date(),
                likes: [],
                views: [],
            });
        }
    }

    return true;
};