import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { date: 'desc' } })
    const messages = await prisma.message.findMany({ orderBy: { date: 'desc' } })
    
    return NextResponse.json({ orders, messages })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}