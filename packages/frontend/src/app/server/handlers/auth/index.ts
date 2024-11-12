import { env } from "process";

type SignUpPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const signup = async (payload: SignUpPayload) => {
  try {
    const response = await fetch(new URL('/auth/signup', env.SERVER_URL), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // accept cors
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.error('An error occurred during signup', error);
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await fetch(new URL('/auth/login', env.SERVER_URL), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // accept cors
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ email, password })
    }).then(async (res) => {
      const data = await res.json();
      const cookies = res.headers.getSetCookie();
      const token = cookies.find((cookie) => cookie.startsWith('token='))?.split("token=")[1];
      return { token, user: data.user};
    });
    return response;
  } catch (error) {
    console.error('An error occurred during login', error);
  }
};

export const me = async (req: Request) => {
  try {
    const response = await fetch(new URL('/api/protected', env.SERVER_URL), {
      method: 'GET',
      headers: req.headers,
      credentials: 'include',
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.error('An error occurred during fetching user', error);
  }
};

export const twitterAuth = async (req: Request) => {
  const { code } = await req.json();
  const cookie = await req.headers.get("cookie");
  console.log({ code, cookie });
  try {
    const response = await fetch(new URL('/api/callback/twitter', env.SERVER_URL), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cookie': cookie || "",
      },
      credentials: 'include',
      body: JSON.stringify({ code, codeVerifier: env.NEXT_PUBLIC_TWITTER_CODE_CHALLENGE })
    }).then(async (res) => await res.json());
    return response;
  } catch (error) {
    console.error('An error occurred during twitter authentication', error);
  }
};

export const blueskyAuth = async (req: Request) => {
  const { code, iss, state } = await req.json();
  const cookie = await req.headers.get("cookie");
  console.log({ code, iss, state, cookie });
  try {
    const response = await fetch(new URL('/api/callback/bluesky', env.SERVER_URL), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cookie': cookie || "",
      },
      credentials: 'include',
      body: JSON.stringify({ code, iss, state })
    }).then(async (res) => await res.json());
    return response;
  } catch (error) {
    console.error('An error occurred during bluesky authentication', error);
  }
}