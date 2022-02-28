import type { Account, Api } from "../api/Api.types.ts";
import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
const env = config({ safe: true });

import { OAuth2Client } from "https://deno.land/x/oauth2_client@v0.2.1/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { upsertUser } from "./account.ts";

const jwtKey = await window.crypto.subtle.importKey("jwk", JSON.parse(env.JWT_SECRET), { name: "HMAC", hash: "SHA-512" }, false, ["sign", "verify"]);

const oauth2Client = new OAuth2Client({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
    redirectUri: "https://appio.link/feedtown-github-callback",
    defaults: {
        scope: "user:email",
    },
});

const generateJwtToken = async (userId: number) => await create({ alg: "HS512", typ: "JWT" }, { userId }, jwtKey);

export const getUserIdFromJwtToken = async (jwtToken: string) => (await verify(jwtToken, jwtKey)).userId as number;


export const getGitHubAuthUrl: Api["getGitHubAuthUrl"] = (): string => {
    return oauth2Client.code.getAuthorizationUri().toString();
    // return "https://github.com/login/oauth/authorize?client_id=" + env.GITHUB_CLIENT_ID + "&scope=user:email";
};


export const getJwtTokenFromGitHubOAuth: Api["getJwtTokenFromGitHubOAuth"] = async (authCode: string): Promise<{
    jwt: string;
    _id: string;
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
        return {
            jwt: await generateJwtToken(userData.id),
            _id: await upsertUser({
                userId: userData.id,
                avatarUrl: userData.avatar_url,
                email: userData.email,
                username: userData.login,
            })
        };
    } catch {
        throw new Error("Could not log in via GitHub");
    }
};
