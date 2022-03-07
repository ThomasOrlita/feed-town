import { ObjectId } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import { Feed } from "../api/Api.types.ts";
import { feedItems } from "../db/models/FeedItem.ts";

export const aggregateFeedItems = async (userId: ObjectId, matchCondition: ObjectId | {
    $in: ObjectId[];
}) => {
   return await feedItems.aggregate([
        {
            '$match': {
                'feedId': matchCondition,
            }
        },
        {
            '$addFields': {
                'viewed': {
                    '$in': [
                        userId, '$views'
                    ]
                }
            }
        }, {
            '$sort': {
                'viewed': 1,
                'dateCreated': -1
            }
        }
    ]).toArray() as Feed.Item.FeedItem[];
}