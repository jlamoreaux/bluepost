import "next";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TWITTER_CODE_CHALLENGE: string;
      NEXT_PUBLIC_URL: string;
      SERVER_URL: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_TWITTER_CLIENT_ID: string;
      NEXT_PUBLIC_TWITTER_CODE_CHALLENGE: string;
    }
  }
}