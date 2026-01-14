import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body

    // Find admin in Database
    // In a real production app, you should use 'username' too, but here we simplify to password match
    // or fetch the specific admin user. Let's fetch the user 'admin'.
    
    const admin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    })

    if (!admin) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Check Password (Direct comparison)
    // Note: For production, you should use bcrypt to hash passwords.
    if (admin.password === password) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}