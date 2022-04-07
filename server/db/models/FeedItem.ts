import { Feed } from "../../api/Api.types.ts";
import db from "../mongo.ts";

export const feedItems = db.collection<Feed.Item.FeedItem>('feedItems');