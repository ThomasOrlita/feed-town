export type FeedItemType = 'WIKIPEDIA_ARTICLE' | 'RSS_ITEM';

export type GeneralContent = {
    title: string;
    imageUrl: string;
    description: string;
    url: string;
};

export type FeedItemWikipediaArticle = {
    type: 'WIKIPEDIA_ARTICLE',
    content: GeneralContent & {
        relatedArticles?: GeneralContent[];
    };
};
export type FeedItemRss = {
    type: 'RSS_ITEM',
    content: GeneralContent;
};

export type FeedItem = FeedItemWikipediaArticle | FeedItemRss;

export type FeedParser<T extends FeedItemType> = (url: string) => (FeedItem | {type: T})[];