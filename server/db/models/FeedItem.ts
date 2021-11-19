import { Bson } from "https://deno.land/x/mongo@v0.27.0/deps.ts";
import db from "../mongo.ts";

export interface FeedItem {
    _id: Bson.ObjectId;
    
};

export const feeds = db.collection<FeedItem>('feedItems');