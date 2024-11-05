import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie';
import { authService } from '../../services/auth/index.ts'
import logger from '../../utils/logger.ts';
import { sign } from 'hono/jwt';

const auth = new Hono()

auth.post('/signup', async (c) => {
  logger.info('Signup request');
  const { email, firstName, lastName, password } = await c.req.json();
  const userResult = await authService.signUp({ email, password, firstName, lastName });
  if (userResult.isErr) {
    logger.warn('Signup failed', { error: userResult.error });
    return c.json({ error: userResult.error }, 400);
  }
  return c.json(userResult.value);
});

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const result = await authService.verifyUser(email, password)
  if (result.isOk && result.value.user) {
    const token = await sign(result.value, process.env.JWT_SECRET)
    setCookie(c, "token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days 
    })
    return c.json({ success: true, user: result.value.user });
  }
  logger.info('Invalid credentials', { email })
  return c.json({ error: 'Invalid credentials' }, 401)
})

auth.post('/logout', async (c) => {
  setCookie(c, 'token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return c.json({ success: true })
})

// Add a route to check authentication status
auth.get('/me', async (c) => {
  const token = getCookie(c, 'token')
  if (!token) {
    return c.json({ authenticated: false })
  }

  try {
    const payload = await c.get('jwtPayload')
    return c.json({ 
      authenticated: true,
      user: payload
    })
  } catch {
    return c.json({ authenticated: false })
  }
})

// auth.get('/twitter', async (c) => {
//   const url = await authService.getTwitterAuthUrl()
//   return c.json({ url })
// })

// auth.get('/twitter/callback', async (c) => {
//   const { oauth_token, oauth_verifier } = c.req.query()
//   const result = await authService.handleTwitterCallback(oauth_token, oauth_verifier)
//   if (result.success) {
//     return c.json(result.user)
//   }
//   return c.json({ error: 'Twitter authentication failed' }, 400)
// })

// auth.get('/bluesky', async (c) => {
//   const url = await authService.getBlueskyAuthUrl()
//   return c.json({ url })
// })

// auth.get('/bluesky/callback', async (c) => {
//   const { code } = c.req.query()
//   const result = await authService.handleBlueskyCallback(code)
//   if (result.success) {
//     return c.json(result.user)
//   }
//   return c.json({ error: 'Bluesky authentication failed' }, 400)
// })

export { auth as authRoutes }