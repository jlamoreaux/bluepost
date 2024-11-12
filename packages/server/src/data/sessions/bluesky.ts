import { type BlueskySession } from "@prisma/client";
import { prisma } from "../../lib/prisma/client.ts";
import { Result } from "../../utils/result.ts";

export const BlueskySessionData = {
  updateSession: async ({ id, userId, accessToken, expires, refreshToken }: Partial<BlueskySession> & { userId: string }): Promise<Result<BlueskySession>> => {
    try {
      const result = await prisma.blueskySession.update({
        where: {
          id,
          userId,
        },
        data: {
          accessToken,
          expires,
          refreshToken,
        },
      });

      if(!result) {
        return Result.err(new Error('Failed to update Bluesky session'));
      }
      return Result.ok(result);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  createSession: async ({ userId, accessToken, expires, refreshToken, ...session }: Omit<BlueskySession, "id">): Promise<Result<BlueskySession>> => {
    try {
      const result = await prisma.blueskySession.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          accessToken,
          expires,
          refreshToken,
          ...session
        },
        update: {
          accessToken,
          expires,
          refreshToken,
          ...session
        }
      });

      if(!result) {
        return Result.err(new Error('Failed to create Bluesky session'));
      }
      return Result.ok(result);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getSessionByUserId: async (userId: string): Promise<Result<BlueskySession | null>> => {
    try {
      const result = await prisma.blueskySession.findFirst({
        where: {
          userId,
        },
      });

      return Result.ok(result);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  deleteSession: async (id: string): Promise<Result<{success: boolean}>> => {
    try {
      await prisma.blueskySession.delete({
        where: {
          id,
        },
      });

      return Result.ok({ success: true });
    } catch (error) {
      return Result.err(error as Error);
    }
  }
}