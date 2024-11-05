import { createClerkClient } from '@clerk/backend'
import type { StatusCode } from 'hono/utils/http-status';

export const clerkClient = createClerkClient({
  domain: process.env.FRONTEND_URL,
  isSatellite: true,
  secretKey: process.env.CLERK_SECRET_KEY,
  telemetry: {
    disabled: true,
  }
});

export type ClerkError = {
  status: StatusCode,
  clerkTraceId: string,
  clerkError: boolean,
  errors: [
    {
      code: string,
      message: string,
      longMessage: string,
      meta: {
         paramName: string
      }
    }
  ]
}