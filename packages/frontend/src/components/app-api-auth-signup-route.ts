'use client'

import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ user: { id: user.id, email: user.email } })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'An error occurred during signup' },
      { status: 500 }
    )
  }
}