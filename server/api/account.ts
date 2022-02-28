import { users } from "../db/models/User.ts";
import { Account, Api } from "./Api.types.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

export const upsertUser = async ({ userId, username, email, avatarUrl }: {
    userId: number;
    username: string;
    email: string;
    avatarUrl: string;
}) => {
    const user = await getUser(userId);
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
        userId,
        username,
        email,
        avatarUrl,
        dateCreated: new Date(),
    })).toHexString();
};

export const getUser = async (userId: number) => {
    return users.findOne({
        userId,
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
