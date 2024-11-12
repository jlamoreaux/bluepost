import { Hono } from "hono";
import type { Variables } from "../../../index.ts";
import { callbackService } from "../../../services/callback/index.ts";
import type { User } from "@prisma/client";
import logger from "../../../utils/logger.ts";

const callback = new Hono<{ Variables: Variables}>()

callback.post('/twitter', async (c) => {
  logger.info('Twitter callback', { body: c.req.json() });
  const user = await c.get('user') as User
  const { code, codeVerifier } = await c.req.json()
  if (!user) {
    logger.info('No user found in payload');
    return c.json({ error: 'User not found' }, 400)
  }
  const result = await callbackService.generateTwitterAuthToken({ code, codeVerifier, userId: user.id });
  if (result.isOk) {
    logger.info('Twitter authentication successful', { result: result.value });
    return c.json(result.value);
  }
  logger.error('Twitter authentication failed', { error: result.error });
  return c.json({ error: 'Twitter authentication failed' }, 400)
});

callback.post('/bluesky', async (c) => {
  logger.info('Bluesky callback', { body: c.req.json() });
  const user = await c.get('user') as User;
  const { code, iss, state } = await c.req.json();
  if (!user) {
    logger.info('No user found in payload');
    return c.json({ error: 'User not found' }, 400);
  }
  const result = await callbackService.generateBlueskyAuthToken({ code, iss, state, userId: user.id });
  if (result.isOk) {
    logger.info('Bluesky authentication successful', { result: result.value });
    return c.json(result.value);
  }
  logger.error('Bluesky authentication failed', { error: result.error });
  return c.json({ error: 'Bluesky authentication failed' }, 400);
});

export{ callback as callbackRoutes};