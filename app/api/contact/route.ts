import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Save message to MySQL
    const newMessage = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email,
        msg: body.message // 'msg' matches the schema we defined earlier
      }
    })

    return NextResponse.json({ success: true, data: newMessage })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}