import type { Feed } from '../../api/Api.types.ts';
import db from "../mongo.ts";

export const feedCollections = db.collection<Feed.Collection.FeedCollection>('feedCollections');