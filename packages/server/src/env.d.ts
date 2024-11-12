declare module "bun" {
  interface Env {
    BSKY_CLIENT_ID: string;
    FRONTEND_URL: `https://${string}`;
    JWT_SECRET: string;
    PORT: number;
    PRIVATE_KEY_1: string;
    PRIVATE_KEY_2: string;
    PRIVATE_KEY_3: string;
    REDIS_URL: string;
    SERVER_URL: string;
    X_API_KEY: string;
    X_API_SECRET: string;
    X_CLIENT_ID: string;
    X_CLIENT_SECRET: string;
    X_BEARER_TOKEN: string;
  }
}