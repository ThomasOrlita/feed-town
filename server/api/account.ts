import { Bson } from "https://deno.land/x/mongo@v0.28.0/deps.ts";
import { users } from "../db/models/User.ts";
import { Account, Api } from "./Api.types.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const upsertUser = async ({ githubUserId, username, email, avatarUrl }: {
    githubUserId: number;
    username: string;
    email: string;
    avatarUrl: string;
}) => {
    const user = await getUserByGitHubId(githubUserId);
    if (user) {
        await users.updateOne({ _id: user._id }, {
            $set: {
                username,
                email,
                avatarUrl,
            },
        });
        return user._id.toHexString();
    }

    return (await users.insertOne({
        githubUserId,
        username,
        email,
        avatarUrl,
        dateCreated: new Date(),
    })).toHexString();
};

export const getUser = async (_id: Bson.ObjectId) => {
    return users.findOne({
        _id,
    }, { noCursorTimeout: false });
};

export const getUserByGitHubId = async (githubUserId: number) => {
    return users.findOne({
        githubUserId,
    }, { noCursorTimeout: false });
};

export const getAccountInfo: Api["getAccountInfo"] = async (jwt?: string) => {
    if (!jwt) throw new Error("No JWT token provided");
    const userId = await getUserIdFromJwtToken(jwt);
    if (!userId) throw new Error("Invalid JWT token");

    const user = await getUser(userId);
    if (!user) throw new Error("User not found");

    return user;
    // return {
    //     _id: user._id,
    //     userId: user.userId,
    //     username: user.username,
    //     email: user.email,
    //     avatarUrl: user.avatarUrl,
    // };
};
