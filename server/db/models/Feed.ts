import type { Feed } from '../../api/Api.types.ts';
import db from "../mongo.ts";

export const feeds = db.collection<Feed.Source.FeedSource>('feeds');