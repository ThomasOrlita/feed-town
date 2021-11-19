import {
    DublinCore,
    MediaRss,
    parseFeed,
} from 'https://deno.land/x/rss@0.5.3/mod.ts';
import type { FeedItem, FeedParser } from '../types.ts';


export const parse: FeedParser<'RSS_ITEM'> = async (url) => {
    const response = await fetch(url);
    const xml = await response.text();

    const { entries } = await parseFeed(xml);

    console.log(entries);
    const rssItems: (FeedItem[] | { type: 'RSS_ITEM'; }) = [];
    for (const entry of entries) {
        rssItems.push({
            type: 'RSS_ITEM',
            content: {
                title: entry.title?.value ?? 'missing title',
                description: entry.description?.value ?? 'missing description',
                imageUrl: entry['media:thumbnails']?.url ?? 'missing image url',
                url: entry.source?.url ?? 'https://unknown.invalid',
            }
        });
    }

    return rssItems;
};