import { AtpAgent, CredentialSession } from "@atproto/api";

const credentialSession = new CredentialSession(new URL("https://bsky.social"))

const bskyClient = new AtpAgent(credentialSession);

export default bskyClient;