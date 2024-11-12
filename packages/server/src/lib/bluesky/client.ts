import { AtpAgent, CredentialSession } from "@atproto/api";
import { NodeOAuthClient, type NodeSavedState, type Session, type RuntimeLock, type NodeSavedSession, type TokenSet } from "@atproto/oauth-client-node";
import { JoseKey } from '@atproto/jwk-jose';
import { BlueskySessionData } from "../../data/sessions/bluesky.ts";
import logger from "../../utils/logger.ts";
import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {maxRetriesPerRequest: null});

const credentialSession = new CredentialSession(new URL("https://bsky.social"))

const bskyClient = new AtpAgent(credentialSession);

export const bskyOAuthClient = await NodeOAuthClient.fromClientId({
 clientId: process.env.FRONTEND_URL + '/oauth/client-metadata.json' as `https://${string}/oauth/client-metadata.json`,

  // Interfacex to store authorization state data (during authorization flows)
  stateStore: {
    async set(key: string, internalState: NodeSavedState): Promise<void> {
      await redisClient.set(key, JSON.stringify(internalState));
    },
    async get(key: string): Promise<NodeSavedState | undefined> {
      const state = await redisClient.get(key);
      if (!state) {
        return undefined;
      }
      return JSON.parse(state);
    },
    async del(key: string): Promise<void> {
      await redisClient.del(key);
    },
  },

  // Interface to store authenticated session data
  sessionStore: {
    async set(sub: string, session: NodeSavedSession): Promise<void> {
      const sessionResult = await BlueskySessionData.createSession({
        userId: sub,
        accessToken: session.tokenSet.access_token,
        expires: new Date(session.tokenSet.expires_at ?? 0),
        refreshToken: session.tokenSet.refresh_token ?? '',
        dpop_key: JSON.stringify(session.dpopJwk),
        ...session.tokenSet,
      });
      if (sessionResult.isErr) {
        logger.error('Failed to create Bluesky session', {error: sessionResult.error});
        return undefined;
      }
      return;
    },
    async get(sub: string): Promise<NodeSavedSession | undefined> {
      const sessionResult = await BlueskySessionData.getSessionByUserId(sub);
      if (sessionResult.isErr) {
        logger.error('Failed to get Bluesky session', {error: sessionResult.error});
        return undefined;
      }
      const session = sessionResult.value;
      if (!session) {
        return undefined;
      }
      return {
        tokenSet: {
          ...session,
          access_token: session.accessToken,
          expires_at: session.expires.toISOString(),
          refresh_token: session.refreshToken,
        },
        dpopJwk: session.dpop_key ? JSON.parse(session.dpop_key) : undefined,
      } as NodeSavedSession;
    },
    async del(sub: string): Promise<void> {
      const sessionResult = await BlueskySessionData.getSessionByUserId(sub);
      if (sessionResult.isErr) {
        logger.error('Failed to get Bluesky session', {error: sessionResult.error});
        return;
      }
      const session = sessionResult.value;
      if (!session) {
        return;
      }
      await BlueskySessionData.deleteSession(session.id);
    },
  },
});

export default bskyClient;