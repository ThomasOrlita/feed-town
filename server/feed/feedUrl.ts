import type { Feed } from '../api/Api.types.ts';

export const getUrlForFeed = (feedInput: Feed.Source.Input): string => {
    if (feedInput.type === 'RSS') return feedInput.url;
    if (feedInput.type === 'WIKIPEDIA_ARTICLE') return '<todo>';
    if (feedInput.type === 'TWITTER_USER_TIMELINE') return (Deno.env.get('RSS_HUB_URL') ?? '').replace('%s', `twitter/user/${feedInput.username}`);
    if (feedInput.type === 'REDDIT_SUBREDDIT') return `https://www.reddit.com/r/${feedInput.subreddit}.rss`;

    throw new Error('Unimplemented input type');
};