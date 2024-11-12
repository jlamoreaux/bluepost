import logger from "../../utils/logger.ts";
import { Result } from "../../utils/result.ts";
import { userService } from "../users/index.ts";
import { xClient } from '../../lib/x/client.ts';
import bskyClient, { bskyOAuthClient } from "../../lib/bluesky/client.ts";

export const callbackService = {
  generateTwitterAuthToken: async ({ userId, code, codeVerifier }: { userId: string, code: string, codeVerifier: string; }): Promise<Result<{ success: boolean; }>> => {
    logger.info("Attempting to generate Twitter auth token", { code, codeVerifier, userId });
    try {
      const TWITTER_OAUTH_PATH = "/auth/callback/twitter";
      const response = await xClient.loginWithOAuth2({ code, codeVerifier, redirectUri: process.env.FRONTEND_URL + TWITTER_OAUTH_PATH });
      const userAccountResult = await userService.getUserById(userId, { includeAccounts: true });
      if (userAccountResult.isErr) {
        return Result.err(userAccountResult.error);
      }
      const account = userAccountResult.value?.accounts?.[0];
      if (!account) {
        logger.warn('No account found', { userId });
        return Result.err(new Error('No account found'));
      }
      const userResult = await userService.updateUserAccount(
        account.id,
        {
          xToken: response.accessToken,
          xTokenExpires: new Date(Date.now() + (response.expiresIn * 1000)),
          xRefreshToken: response.refreshToken
        });
      if (userResult.isErr) {
        return Result.err(userResult.error);
      }
      return Result.ok({ success: true });
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  generateBlueskyAuthToken: async ({ userId, code, iss, state }: { userId: string, code: string, iss: string, state: string; }): Promise<Result<{ success: boolean; }>> => {
    logger.info("Attempting to generate Bluesky auth token", { code, iss, state, userId });
    try {
      const BLUESKY_OAUTH_PATH = "/auth/callback/bluesky";
      const response = await bskyOAuthClient.callback(new URLSearchParams({ code, iss, state }));
      logger.info("Bluesky response", response);
      const userAccountResult = await userService.getUserById(userId, { includeAccounts: true });
      if (userAccountResult.isErr) {
        logger.warn('Failed to get user account', { error: userAccountResult.error });
        return Result.err(userAccountResult.error);
      }
      const account = userAccountResult.value?.accounts?.[0];
      if (!account) {
        logger.warn('No account found', { userId });
        return Result.err(new Error('No account found'));
      }
      return Result.ok({ success: true });
    } catch (error) {
      return Result.err(error as Error);
    }
  }
}