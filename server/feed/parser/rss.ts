import {
    DublinCore,
    MediaRss,
    parseFeed,
} from "https://deno.land/x/rss@0.5.3/mod.ts";
import { FeedParser } from "./types.ts";

const response = await fetch(
    "https://websec.blog/feed",
);
const xml = await response.text();

// Optional destructuring assignment
const { entries } = await parseFeed(xml);

// Access fields using the DublinCore and MediaRss enums
const dcTitle = entries[0][DublinCore.Title];
const mediaContent = entries[0][MediaRss.Content];

console.log(entries);



export const parse: FeedParser<'RSS_ITEM'> = (url) => {
    return [];
};