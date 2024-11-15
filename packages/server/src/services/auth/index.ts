import {hash, compareSync, genSalt} from 'bcrypt';
import { userService } from '../users/index.ts';
import { Result } from '../../utils/result.ts';
import logger from '../../utils/logger.ts';
import type { User } from '@prisma/client';

type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

type BaseUser = {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  signUp: async ({ email, firstName, lastName, password }: SignUpData): Promise<Result<User>> => {
    try {
      const hashedPassword = await hash(password, await genSalt(10));
      const userResult = await userService.createUser({ firstName, lastName, email, password: hashedPassword, provider: 'email', providerAccountId: email });
      return userResult;
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  verifyUser: async (email: string, password: string): Promise<Result<{success: boolean, user?: BaseUser}>> => {
    const userResult = await userService.getUserByEmailForAuth(email);
    if (userResult.isOk) {
      const user = userResult.value;
      if (!user || !user.accounts.length) {
        logger.info('No user found', { email });
        return Result.ok({ success: false });
      }
      const account = user.accounts.find((a) => a.providerAccountId === email);
      if (!account || !account.password) {
        logger.info('No account found', { email });
        return Result.ok({ success: false });
      }
      const passwordMatch = compareSync(password, account?.password);
      if (passwordMatch) {
        const { id, firstName, lastName } = user;
        const twitterStatus = user.accounts[0]?.xToken ? 'active' : 'inactive';
        const bskyStatus = user.accounts[0]?.bskyTokenExpires ? (new Date(user.accounts[0].bskyTokenExpires) > new Date() ? 'active' : 'expired') : 'inactive';
        const returnUser = { id, firstName, lastName, email, twitterStatus, bskyStatus };
        logger.info('User logged in', { returnUser });
        return Result.ok({ success: true, user: returnUser });
      }
    }
    logger.info('Invalid password', { email });
    return Result.ok({ success: false });
  },
};