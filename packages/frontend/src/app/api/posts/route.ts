import { getPosts } from "@/app/server/handlers/posts";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
  try {
    const result = await getPosts(req);
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