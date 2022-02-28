import { users } from "../db/models/User.ts";
import { Api } from "./Api.types.ts";
import { getUserIdFromJwtToken } from "./auth.ts";

const getUserCreateIfNotExists = async (userId: number, userData: {
    userId: number;
    username: string;
    email: string;
    avatarUrl: string;
}) => {
    const user = await getUser(userId);
    if (user) {
        return user;
    }

    await users.insertOne({
        userId,
        username: userData.username,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        dateCreated: new Date(),
    });

    return await getUser(userId);
};

const getUser = async (userId: number) => {
    return users.findOne({
        userId,
    });
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
