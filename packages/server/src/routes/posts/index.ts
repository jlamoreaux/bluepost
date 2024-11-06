import { Hono } from 'hono'
import { postService } from '../../services/posts/index.ts'
import { decode } from 'hono/jwt';
import type { User } from '@prisma/client';
import logger from '../../utils/logger.ts';
import type { Variables } from '../../index.ts';

const posts = new Hono < { Variables: Variables }>()

posts.get('/', async (c) => {
  logger.info("/api/posts");
  const user = c.get('user') as User;
  const postsResult = await postService.getPostsByUserId(user?.id)
  if (postsResult.isErr) {
    logger.warn('Failed to get posts', { error: postsResult.error });
    return c.json({ error: postsResult.error }, 500);
  }
  logger.info('Posts retrieved', { posts: postsResult.value });
  return c.json({posts: postsResult.value})
})

// posts.post('/', async (c) => {
//   const userId = c.get('userId')
//   const { content } = await c.req.json()
//   const post = await postService.createPost(userId, content)
//   return c.json(post)
// })

export { posts as postRoutes }