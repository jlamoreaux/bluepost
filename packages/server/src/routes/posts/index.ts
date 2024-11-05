// import { Hono } from 'hono'
// import { postService } from '../services/posts'

// const posts = new Hono()

// posts.get('/', async (c) => {
//   const userId = c.get('userId') // Assuming you've set this in an auth middleware
//   const posts = await postService.getPosts(userId)
//   return c.json(posts)
// })

// posts.post('/', async (c) => {
//   const userId = c.get('userId')
//   const { content } = await c.req.json()
//   const post = await postService.createPost(userId, content)
//   return c.json(post)
// })

// export { posts as postRoutes }