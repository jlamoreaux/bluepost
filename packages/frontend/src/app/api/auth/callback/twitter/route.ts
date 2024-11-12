import { twitterAuth } from "@/app/server/handlers/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const result = await twitterAuth(req);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || 'An error occurred during signup' },
        { status: 500 }
      );
    }
  }
}