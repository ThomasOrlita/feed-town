import { Bson } from "https://deno.land/x/mongo@v0.27.0/mod.ts";
import { FeedSourceType } from "../../feed/types.ts";
import db from "../mongo.ts";

export interface FeedSource {
    _id: Bson.ObjectId;
    type: FeedSourceType;
    rssOptions?: {
        url: string;
    };
};

export const feedSources = db.collection<FeedSource>('feedSources');