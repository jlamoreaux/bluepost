import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { env } from "process";

const isDev = true;
const publicUrl = env.NEXT_PUBLIC_URL;
const url = isDev ? "http://127.0.0.1:3000" : publicUrl; // since I'm using ipv6, use ::1 instead 127.0.0.1
const enc = encodeURIComponent;

export const client = await BrowserOAuthClient.load({
  clientId: !isDev && publicUrl ? `${publicUrl}/client-metadata.json` : `http://localhost?redirect_uri=${enc(`${url}/auth/callback/bluesky`)}&scope=${enc('atproto transition:generic')}`,
  handleResolver: "https://bsky.social",
})