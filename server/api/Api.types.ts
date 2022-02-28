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
            author?: Bson.ObjectId;
        };

        export interface FeedItem {
            _id: Bson.ObjectId;
            feedId: Bson.ObjectId;
            comments: Feed.Item.Comment[];
            content: Feed.Item.Content;
            dateCreated: Date;
        };
    }

    export namespace Collection {
        export interface FeedCollection {
            _id: Bson.ObjectId;
            title: string;
            dateCreated: Date;
            author?: Bson.ObjectId;
            feedSources: Bson.ObjectId[];
        };
        export interface FeedCollectionWithFeedSources extends Omit<FeedCollection, 'feedSources'> {
            feedSources: Feed.Source.FeedSource[];
        };
    }


    export type FeedParser<T extends Feed.Type> = (url: string) => Promise<(Feed.Item.Content & { type: T; })[]>;
}

export namespace Account {
    export interface User {
        _id: Bson.ObjectId;
        userId: number;
        username: string;
        email: string;
        dateCreated: Date;
        avatarUrl: string;
    };
}

// types of all exposed API functions
// must be top-level keys
// and not use 'typeof' other functions
export type Api = {
    // feeds
    getFeeds: (jwt?: string) => Promise<Feed.Source.FeedSource[]>;

    // feed
    addFeed: (type: string, input: Feed.Source.Input, jwt?: string) => Promise<{ feedId: string; }>;
    getFeed: (options: { feedId: string; }, jwt?: string) => Promise<{ feed: Feed.Source.FeedSource, items: Feed.Item.FeedItem[]; }>;

    // feed item
    getFeedItem: (options: { itemId: string; }, jwt?: string) => Promise<{ feed: Feed.Source.FeedSource, item: Feed.Item.FeedItem; }>;

    // comments
    addComment: (options: { itemId: string; comment: string; }, jwt?: string) => Promise<{ _id: string; }>;

    // collections
    getFeedCollections: (jwt?: string) => Promise<Feed.Collection.FeedCollection[]>;
    getFeedCollectionsWithFeedSources: (jwt?: string) => Promise<Feed.Collection.FeedCollectionWithFeedSources[]>;

    // collection
    addFeedCollection: (options: { title: string; }, jwt?: string) => Promise<{ _id: string; }>;
    addFeedToCollection: (options: { collectionId: string; feedId: string; }, jwt?: string) => Promise<{}>;
    removeFeedFromCollection: (options: { collectionId: string; feedId: string; }, jwt?: string) => Promise<{}>;
    getFeedCollection: (options: { feedCollectionId: string; }, jwt?: string) => Promise<Feed.Collection.FeedCollectionWithFeedSources>;
    getFeedCollectionFeed: (options: { feedCollectionId: string; }, jwt?: string) => Promise<Feed.Item.FeedItem[]>;

    // auth
    getGitHubAuthUrl: () => string;
    getJwtTokenFromGitHubOAuth: (authCode: string) => Promise<{
        jwt: string;
        _id: string;
    }>;

    // account
    getAccountInfo: (jwt?: string) => Promise<Account.User>;
};