import type { Feed } from '../../api/Api.types.ts';
import db from "../mongo.ts";

export const feedSources = db.collection<Feed.Source.FeedSource>('feedSources');