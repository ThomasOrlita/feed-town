import {
    parseFeed,
} from 'https://deno.land/x/rss@0.5.3/mod.ts';
import { Feed } from "../../api/Api.types.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.19-alpha/deno-dom-native.ts";


export const parse: Feed.FeedParser<'RSS'> = async (url: string) => {
    const response = await fetch(url);
    const xml = await response.text();

    const { entries } = await parseFeed(xml);

    console.log(entries);
    const rssItems: Feed.Item.Rss[] = [];
    for (const entry of entries) {
        try {
            const title = (new DOMParser().parseFromString(entry.title?.value ?? 'An untitled post', 'text/html'))?.textContent ?? '';
            const description = (new DOMParser().parseFromString(entry.description?.value ?? entry?.content?.value ?? '', 'text/html'))?.textContent;

            rssItems.push({
                type: 'RSS',
                title,
                description,
                imageUrl: entry['media:thumbnails']?.url ?? entry['media:content']?.[0]?.url ?? undefined,
                url: entry.source?.url ?? entry.links[0]?.href ?? 'https://unknown.invalid',
            });
        } catch (e) {
            console.log(`Error parsing entry`);
            console.log(entry);
            console.error(e);
        }
    }
    return rssItems;
};