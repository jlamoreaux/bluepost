// packages/backend/src/queue/workers.ts

import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { userService} from "../services/users/index.ts"
import { createUserClient } from '../lib/x/client.ts';
import { Result } from '../utils/result.ts';
import { postService } from '../services/posts/index.ts';
import logger from '../utils/logger.ts';

const prisma = new PrismaClient();
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {maxRetriesPerRequest: null});
const CROSSPOST_QUEUE = 'crosspost';

export interface CrosspostJob {
  userId: string;
  content: string;
  source: 'twitter' | 'bluesky';
  postId: string;
}

export const startWorkers = () => {
  const crosspostWorker = new Worker(CROSSPOST_QUEUE, async (job) => {
    logger.info('Processing job', {jobId: job.id});
    const { userId, content, source, postId } = job.data as CrosspostJob;

    const userResult = await userService.getUserById(userId, {includeAccounts: true});

    if (userResult.isErr || !userResult.value) {
      throw new Error(`User not found: ${userId}`);
    }

    const user = userResult.value;

    if (source === 'bluesky') {
      logger.info('Crossposting from bluesky', user);
      const twitterAccount = user.accounts?.find(a => a.xToken?.length);
      if (twitterAccount && twitterAccount.xToken) {
        const userClient = await createUserClient(user)
        if (!userClient) {
          return Result.err(new Error('User has no xToken'));
        }
        logger.info('user client created');
        const result = await userClient.v2.tweet(content);
        logger.info("Attempted to post to X", result);
        await postService.updatePost(postId, { xPostId: result.data.id, crossPostedTo: 'twitter' });
        logger.info("Successfully cross-posted to X", {postId, xPostId: result.data.id, userId: user.id});
        return;
      }
      logger.info('User has no twitter account');
    }

  }, { connection });

  crosspostWorker.on('completed', (job) => {
    logger.info("Job has completed successfully", {jobId: job?.id});
  });

  crosspostWorker.on('failed', (job, error) => {
    logger.error("Job has failed", {error, jobId: job?.id});
  });

  logger.info('Workers started');
};