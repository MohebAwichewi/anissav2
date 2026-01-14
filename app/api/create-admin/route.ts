import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check if admin exists
    const existing = await prisma.admin.findUnique({ where: { username: 'admin' } })
    
    if (existing) {
      return NextResponse.json({ message: 'Admin user already exists!' })
    }

    // Create the admin user
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: 'mysecretpassword123' // You can change this later
      }
    })

    return NextResponse.json({ success: true, message: 'Admin user created! Login with: admin / mysecretpassword123' })
  } catch (e) {
    return NextResponse.json({ error: 'Error creating admin' }, { status: 500 })
  }
}