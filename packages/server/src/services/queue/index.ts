import { Queue } from 'bullmq'
import type { CrosspostJob } from '../../queue/workers.ts';

const crosspostQueue = new Queue('crosspost', {
  connection: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: null,
  },
});

export const queueService = {
  addToQueue: (name: string, data: CrosspostJob) => crosspostQueue.add(name, data),
}