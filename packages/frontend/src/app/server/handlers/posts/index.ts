import { env } from "process";

export const getPosts = async (req: Request) => {
  try {
    const response = await fetch(new URL('/api/posts', env.SERVER_URL), {
      method: 'GET',
      headers: req.headers,
      credentials: 'include',
    }).then(async (res) => {
      return await res.json();
    });
    return response;
  } catch (error) {
    console.error('An error occurred fetching posts', error);
  }
}