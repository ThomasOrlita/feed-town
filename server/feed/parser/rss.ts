import {
    parseFeed,
} from 'https://deno.land/x/rss@0.5.5/mod.ts';
import { Feed } from "../../api/Api.types.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.19-alpha/deno-dom-native.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.5/src/types/feed.ts";


export const parse: Feed.FeedParser<'RSS'> = async (url: string) => {
    const response = await fetch(url);
    const xml = await response.text();

    let entries: FeedEntry[] = [];
    try {
        entries = (await parseFeed(xml)).entries;
    } catch (e) {
        console.error(e);
        throw new Error(`Could not parse this feed. Please try again later.`);
    }

    console.log(entries);
    const rssItems: Feed.Item.Rss[] = [];
    for (const entry of entries) {
        try {
            const title = (new DOMParser().parseFromString(entry.title?.value ?? 'An untitled post', 'text/html'))?.textContent ?? '';
            let description: string = (new DOMParser().parseFromString(entry.description?.value ?? entry?.content?.value ?? '', 'text/html'))?.textContent ?? '';

            if (description.trimStart().startsWith('<')) {
                // if the description starts with <, it's probably an HTML description
                // safely parse it as HTML and get the text content
                // the resulting text will be stripped of tags for display reasons only
                // and it must not be used in an HTML context as it can be unsafe
                description = (new DOMParser().parseFromString(description, 'text/html'))?.documentElement?.textContent ?? '';
            }

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