import { type Context, type Next } from 'hono'

export const errorHandler = async (c: Context, next: Next) => {
  try {
    console.log("oops");
    await next()
  } catch (err) {
    console.error('Error:', err)
    if (err instanceof Error) {
      return c.json({ error: err.message }, 500)
    }
    return c.json({ error: 'An unexpected error occurred' }, 500)
  }
}