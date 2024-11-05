import type { Account, User } from "@prisma/client";
import { prisma } from "../../lib/prisma/client.ts";
import { Result } from "../../utils/result.ts";
import logger from "../../utils/logger.ts";

type CreateUser = {
  email: string;
  provider: string;
  providerAccountId: string;
  firstName: string;
  lastName: string;
  password?: string;
  bskyDid?: string;
};

type UpdateUser = Partial<Omit<User, "id">>;

export const userService = {
  createUser: async ({ email, provider, providerAccountId, bskyDid, firstName, lastName, password }: CreateUser): Promise<Result<User>> => {
    try {
      const value = await prisma.user.create({
        data: {
          email,
          bskyDid,
          firstName,
          lastName,
          accounts: {
            create: {
              provider,
              providerAccountId,
              password: provider === 'email' ? password : null,
            }
          }
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getUserById: async (userId: string, options?: { includeAccounts?: boolean}): Promise<Result<User & {accounts?: Account[]} | null>> => {
    try {
      const value = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        ...options?.includeAccounts && {
          include: {
            accounts: {
              select: {
                id: true,
                xToken: true,
                xTokenExpires: true,
                xRefreshToken: true,
              }
            },
          },
        }
      });
      logger.info("User found", { value });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getUserByEmail: async (email: string): Promise<Result<User | null>> => {
    try {
      const value = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getUserByEmailForAuth: async (email: string): Promise<Result<User & {accounts: Account[]} | null>> => {
    try {
      const value = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          accounts: true,
        }
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getUserByBskyDid: async (bskyDid: string): Promise<Result<User & {accounts: {xToken: string | null}[]} | null>> => {
    try {
      const value = await prisma.user.findFirst({
        where: {
          bskyDid,
        },
        include: {
          accounts: {
            select: {
              xToken: true,
            }
          }
        }
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  updateUser: async (id: string, data: UpdateUser): Promise<Result<User>> => {
    try {
      const value = await prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  deleteUser: async (userId: string): Promise<Result<User>> => {
    try {
      const value = await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  updateUserAccount: async (accountId: string, data: Partial<Omit<Account, "id">>): Promise<Result<Account>> => {
    try {
      const value = await prisma.account.update({
        where: {
          id: accountId,
        },
        data,
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
};