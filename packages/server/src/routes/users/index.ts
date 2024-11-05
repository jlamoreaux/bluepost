// import { Hono } from 'hono'
// import { userService } from '../services/users'

// const users = new Hono()

// users.get('/me', async (c) => {
//   const userId = c.get('userId')
//   const user = await userService.getUser(userId)
//   return c.json(user)
// })

// users.put('/me', async (c) => {
//   const userId = c.get('userId')
//   const userData = await c.req.json()
//   const updatedUser = await userService.updateUser(userId, userData)
//   return c.json(updatedUser)
// })

// export { users as userRoutes }