import { TwitterApi } from "twitter-api-v2";
import logger from "../../utils/logger.ts";
import type { Account } from "@prisma/client";
import { isToken } from "typescript";
import { userService } from "../../services/users/index.ts";
import { authService } from "../../services/auth/index.ts";

type UserWithAccounts = {
  id: string;
  accounts?: Partial<Account>[]
}

const isTokenExpired = (expires: Date) => {
  return  expires < new Date();
}

export const xClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET,
});


export const createUserClient = async (user: UserWithAccounts) => {
  const account = user.accounts?.find(a => a.xToken?.length);
  if (!account?.id || !account.xTokenExpires || !account.xToken || !account.xRefreshToken) {
    logger.warn("Account has no xToken", { account });
    return null;
  }
  try {
    let token = account.xToken;
    if (isTokenExpired(account.xTokenExpires)) {
      logger.info("Token expired, refreshing", { expires: account.xTokenExpires });
      await xClient.refreshOAuth2Token(account.xRefreshToken).then(async (result) => {
        const updateResult = await userService.updateUserAccount(account.id!, { xToken: result.accessToken, xTokenExpires: new Date(Date.now() + result.expiresIn * 1000), xRefreshToken: result.refreshToken });
        if (updateResult.isErr) {
          logger.warn("Error updating account", { error: updateResult.error });
        }
        token = result.accessToken;
        logger.info("Refreshed token");
      });
    }

    return new TwitterApi(token);
  } catch (error) {
    logger.error("Error creating client", { error: error as Error });
    return null;
  }
}