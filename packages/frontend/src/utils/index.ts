import {client} from "../lib/blueksy/client";

const TWITTER_OAUTH_PATH = "/auth/callback/twitter";

export const getTwitterAuthUrl = (redirectUrl?: string) => {
  const url = new URL("/i/oauth2/authorize", "https://twitter.com");
  url.searchParams.set("client_id", process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!);
  url.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_URL + (redirectUrl || TWITTER_OAUTH_PATH)}`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "tweet.read+tweet.write+users.read+offline.access");
  url.searchParams.set("state", "state");
  url.searchParams.set("code_challenge", process.env.NEXT_PUBLIC_TWITTER_CODE_CHALLENGE!);
  url.searchParams.set("code_challenge_method", "plain");

  return url.toString();
};

// const BSKY_OAUTH_PATH = "/auth/callback/bluesky";

export const getBskyAuthUrl = async (handle: string) => {
  try {
    return await client.authorize(handle, {
      state: "state",
      // prompt: 'none',
    }) as {href: string};
  } catch (error) {
    console.error(error);
    return "";
  }
};