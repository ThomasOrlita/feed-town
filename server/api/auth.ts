import type { Account, Api } from "../api/Api.types.ts";

import { OAuth2Client } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { upsertUser } from "./account.ts";
import { Bson } from "https://deno.land/x/mongo@v0.28.0/deps.ts";

const jwtKey = await window.crypto.subtle.importKey("jwk", JSON.parse(Deno.env.get('JWT_SECRET') ?? ''), { name: "HMAC", hash: "SHA-512" }, false, ["sign", "verify"]);

const oauth2Client = new OAuth2Client({
    clientId: Deno.env.get('GITHUB_CLIENT_ID') ?? '',
    clientSecret: Deno.env.get('GITHUB_CLIENT_SECRET') ?? '',
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
    redirectUri: "https://appio.link/feedtown-github-callback",
    defaults: {
        scope: "user:email",
    },
});

const generateJwtToken = async (userId: string) => await create({ alg: "HS512", typ: "JWT" }, { userId }, jwtKey);

export const getUserIdFromJwtToken = async (jwtToken?: string) => {
    if (!jwtToken) throw new Error("No JWT token provided");

    return new Bson.ObjectId((await verify(jwtToken, jwtKey)).userId);
};

export const getGitHubAuthUrl: Api["getGitHubAuthUrl"] = (): string => {
    return oauth2Client.code.getAuthorizationUri().toString();
};


export const getJwtTokenFromGitHubOAuth: Api["getJwtTokenFromGitHubOAuth"] = async (authCode: string): Promise<{
    jwt: string;
    userId: string;
}> => {
    try {
        const tokens = await oauth2Client.code.getToken(oauth2Client.config.redirectUri + "?code=" + authCode);

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const userData: {
            login: string;
            id: number;
            email: string;
            avatar_url: string;
        } = await userResponse.json();

        console.log(userData);
        const userId = await upsertUser({
            githubUserId: userData.id,
            avatarUrl: userData.avatar_url,
            email: userData.email,
            username: userData.login,
        });
        return {
            jwt: await generateJwtToken(userId),
            userId
        };
    } catch {
        throw new Error("Could not log in via GitHub");
    }
};
