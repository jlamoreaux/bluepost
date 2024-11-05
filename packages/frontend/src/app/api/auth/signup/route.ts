import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const hashedPassword = await hash(password, 12)


    console.log('Signup request received', email, password)

    return NextResponse.json({ user: { email, hashedPassword } })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || 'An error occurred during signup' },
        { status: 500 }
      );
    }
  }
}