import { Api } from "../api/Api.types.ts";
import { feeds } from "../db/models/Feed.ts";
import { fetchFeedItems } from "../feed/fetchFeedItems.ts";
import type { Feed } from '../api/Api.types.ts';
import { getUserIdFromJwtToken } from "./auth.ts";

export const addFeed: Api['addFeed'] = async (title: string, input: Feed.Source.Input, jwt?: string) => {
    const userId = await getUserIdFromJwtToken(jwt);

    if (input.type === 'RSS') {
        if (!(input.url?.startsWith('http://') || input.url?.startsWith('https://'))) {
            throw new Error('Invalid URL');
        }
        try {
            const urlObj = new URL(input.url);
            input.url = urlObj.toString();
            title ??= 'RSS feed of ' + urlObj.hostname;
        } catch {
            throw new Error('Invalid URL');
        }
    } else if (input.type === 'TWITTER_USER_TIMELINE') {
        input.username = input.username.replaceAll('@', '').toLowerCase();
        // validate twitter username
        if (!input.username.match(/^[a-zA-Z0-9_]{1,15}$/)) {
            throw new Error('Invalid Twitter username');
        }
    } else if (input.type === 'REDDIT_SUBREDDIT') {
        // remove leading /r/
        input.subreddit = input.subreddit.replaceAll('r/', '').replaceAll('/r/', '').toLowerCase();

        if (!input.subreddit.match(/^[a-zA-Z0-9_]{1,21}$/)) {
            throw new Error('Invalid subreddit name');
        }
    } else {
        throw new Error('Invalid feed type');
    }

    const feedId = await feeds.insertOne({
        owner: userId,
        input,
        title,
        dateCreated: new Date(),
    });

    await fetchFeedItems(feedId);

    return {
        feedId: feedId.toHexString()
    };
};