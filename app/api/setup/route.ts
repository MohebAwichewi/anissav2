import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: process.env.ADMIN_PASSWORD || 'mysecretpassword123'
      }
    })
    return NextResponse.json({ success: true, message: 'Admin created on Neon DB!' })
  } catch (e) {
    return NextResponse.json({ error: 'Admin might already exist' })
  }
}