import type { Feed } from '../api/Api.types.ts';
import { config } from 'https://deno.land/x/dotenv@v3.0.0/mod.ts';
const env = config({ safe: true });

export const getUrlForFeed = (feedInput: Feed.Source.Input): string => {
    if (feedInput.type === 'RSS') return feedInput.url;
    if (feedInput.type === 'WIKIPEDIA_ARTICLE') return '<todo>';
    if (feedInput.type === 'TWITTER_USER_TIMELINE') return env.RSS_HUB_URL.replace('%s', `twitter/user/${feedInput.username}`);
    if (feedInput.type === 'REDDIT_SUBREDDIT') return `https://www.reddit.com/r/${feedInput.subreddit}.rss`;

    throw new Error('Unimplemented input type');
};