import { Bson } from "https://deno.land/x/mongo@v0.27.0/deps.ts";
import db from "../mongo.ts";

export interface Feed {
    _id: Bson.ObjectId;
    source: Bson.ObjectId;
    title: string;
};

export const feeds = db.collection<Feed>('feeds');