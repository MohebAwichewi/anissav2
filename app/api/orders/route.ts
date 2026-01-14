import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 1. GET: Fetch all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}

// 2. POST: Save a new order
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cart, total, customerInfo } = body

    // --- KEY CHANGE ---
    // Instead of a simple string, we save the full cart data as a JSON string.
    // This allows us to retrieve images, prices, and quantities later.
    const cartData = JSON.stringify(cart)

    const customerString = `${customerInfo.name} | ${customerInfo.phone}`

    const newOrder = await prisma.order.create({
      data: {
        customer: customerString,
        item: cartData, // Saving JSON here
        total: parseFloat(total),
        status: 'En attente',
      }
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Order failed' }, { status: 500 })
  }
}

// 3. DELETE: Remove an order
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (id) {
    await prisma.order.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'ID missing' }, { status: 400 })
}

// 4. PUT: Update Status
export async function PUT(req: Request) {
    const body = await req.json()
    const { id, status } = body
    
    const updated = await prisma.order.update({
        where: { id: Number(id) },
        data: { status }
    })
    return NextResponse.json(updated)
}