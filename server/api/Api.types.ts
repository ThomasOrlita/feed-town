import { Bson } from "https://deno.land/x/mongo@v0.28.0/deps.ts";

export namespace Feed {
    export type Type = 'RSS' | 'WIKIPEDIA_ARTICLE' | 'TWITTER_USER_TIMELINE' | 'REDDIT_SUBREDDIT';

    export namespace Source {
        type Base = {
            type: Type;
        };

        export type Rss = Base & {
            type: 'RSS',
            url: string;
        };

        export type WikipediaArticle = Base & {
            type: 'WIKIPEDIA_ARTICLE',
        };

        export type TwitterUserTimeline = Base & {
            type: 'TWITTER_USER_TIMELINE',
            username: string;
        };
        export type RedditSubreddit = Base & {
            type: 'REDDIT_SUBREDDIT',
            subreddit: string;
        };

        export type Input = Rss | WikipediaArticle | TwitterUserTimeline | RedditSubreddit;


        export interface FeedSource {
            _id: Bson.ObjectId;
            // owner: Bson.ObjectId;
            title: string;
            input: Feed.Source.Input;
            dateCreated: Date;
            lastChecked?: Date;
        };

    }

    export namespace Item {
        type GeneralContent = {
            type: Feed.Type;
            title: string;
            imageUrl?: string;
            description?: string;
            url: string;
        };

        export type Rss = GeneralContent & {
            type: 'RSS',
        };

        export type WikipediaArticle = GeneralContent & {
            type: 'WIKIPEDIA_ARTICLE',
            relatedArticles?: GeneralContent[];
        };

        export type TwitterUserTimeline = GeneralContent & {
            type: 'TWITTER_USER_TIMELINE',
            username: string;
        };

        export type RedditSubreddit = GeneralContent & {
            type: 'REDDIT_SUBREDDIT',
        };

        export type Content = Rss | WikipediaArticle | TwitterUserTimeline | RedditSubreddit;

        export type Comment = {
            _id: Bson.ObjectId;
            content: string;
            dateCreated: Date;
            author: Bson.ObjectId;
        };

        export interface FeedItem {
            _id: Bson.ObjectId;
            feedId: Bson.ObjectId;
            comments: Feed.Item.Comment[];
            content: Feed.Item.Content;
            dateCreated: Date;
        };
    }

    export type FeedParser<T extends Feed.Type> = (url: string) => Promise<(Feed.Item.Content & { type: T; })[]>;
}

// types of all exposed API functions
// must be top-level keys
// and not use 'typeof' other functions
export type Api = {
    addFeed: (type: string, input: Feed.Source.Input, jwt?: string) => Promise<{ feedId: string; }>;
    getFeed: (options: { feedId: string; }, jwt?: string) => Promise<{ feed: Feed.Source.FeedSource, items: Feed.Item.FeedItem[]; }>;
    getFeeds: (jwt?: string) => Promise<Feed.Source.FeedSource[]>;
    getFeedItem: (options: { itemId: string; }, jwt?: string) => Promise<Feed.Item.FeedItem>;
};