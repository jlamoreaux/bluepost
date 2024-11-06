import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { authRoutes } from './routes/auth/index.ts'
import { postRoutes } from './routes/posts/index.ts'
// import { userRoutes } from './routes/users'
import { errorHandler } from './utils/errorHandler.ts'
import { startListeners } from './listeners/index.ts'
import { env } from 'process';
import { decode } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { contextStorage } from 'hono/context-storage';
import logger from './utils/logger.ts';
import type { User } from '@prisma/client';
import { startWorkers } from './queue/workers.ts';


export type Variables = {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}

const app = new Hono<{Variables: Variables}>({
  strict: true,
})


app.use(contextStorage())
app.use('*', errorHandler);


app.use('/api/*', async (c, next) => {
  const token = getCookie(c, 'token')
  if (!token) {
    logger.info('No token found in cookie');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await decode(token).payload as {user? : User};
    logger.info('Payload', { payload });
    if (!payload.user) {
      logger.info('No user found in payload');
      return c.json({ error: 'Unauthorized' }, 401);
    }
    c.set('user', payload.user);
    return next();
  } catch (error) {
    return c.json({ error }, 401);
  }
})

app.get('/api/protected', async (c) => {
  const user = c.get('user')
  return c.json({ message: 'Protected route', user })
})

app.route('/auth', authRoutes);
app.route('/api/posts', postRoutes)
// app.route('/users', userRoutes)

const port = env.PORT || 8080

console.log(`XPost server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

// Start listeners and queue workers
startListeners()
startWorkers()