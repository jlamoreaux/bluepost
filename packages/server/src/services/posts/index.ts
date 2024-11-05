import type { Post } from "@prisma/client";
import { prisma } from "../../lib/prisma/client.ts";
import { Result } from "../../utils/result.ts";
import logger from "../../utils/logger.ts";

type CreatePostData = {
  userId: string;
  content: string;
  source: string;
  bskyPostId?: string;
  xPostId?: string;
};
type UpdatePostData = Partial<Post>;


export const postService = {
  createPost: async ({ userId, content, source}:CreatePostData): Promise<Result<Post>> => {
    try {
      const value = await prisma.post.create({
        data: {
          content,
          userId,
          source,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  deletePost: async (postId: string): Promise<Result<Post>> => {
    try {
      const value = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  updatePost: async (postId: string, data: UpdatePostData): Promise<Result<Post>> => {
    try {
      const value = await prisma.post.update({
        where: {
          id: postId,
        },
        data,
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getPostById: async (postId: string): Promise<Result<Post | null>> => {
    try {
      const value = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getPostByBlueskyId: async (bskyPostId: string): Promise<Result<Post | null>> => {
    try {
      const value = await prisma.post.findFirst({
        where: {
          bskyPostId,
        },
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  },
  getPostsByUserId: async (userId: string, options?: { take?: number; skip?: number; }): Promise<Result<Post[]>> => {
    try {
      const value = await prisma.post.findMany({
        where: {
          userId,
        },
        take: options?.take,
        skip: options?.skip,
      });
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as Error);
    }
  }
};