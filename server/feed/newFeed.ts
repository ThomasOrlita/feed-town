import { Api } from "../api/Api.types.ts";
import { feeds } from "../db/models/Feed.ts";
import { feedSources } from "../db/models/FeedSource.ts";

export const addFeed: Api['addFeed'] = async ({
    title,
    url
}: {
    title: string;
    url: string;
}) => {

    if (!(url?.startsWith('http://') || url?.startsWith('https://'))) {
        throw new Error('Invalid URL');
    }

    const feedSource = await feedSources.insertOne({
        type: 'RSS',
        rssOptions: {
            url
        },
    });

    const feedResult = await feeds.insertOne({
        source: feedSource,
        title,
    });

    return feedResult;
    //console.log((await test.find(undefined, { noCursorTimeout: false }).toArray())[0]);
};