declare module "bun" {
  interface Env {
    FRONTEND_URL: string;
    JWT_SECRET: string;
    PORT: number;
    REDIS_URL: string;
    X_API_KEY: string;
    X_API_SECRET: string;
    X_CLIENT_ID: string;
    X_CLIENT_SECRET: string;
    X_BEARER_TOKEN: string;
  }
}