import { signup } from '@/app/server/handlers/auth';
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }
    const result = await signup({email, password, firstName, lastName});
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