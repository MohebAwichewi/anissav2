import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all data for the dashboard
export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  const orders = await prisma.order.findMany({ orderBy: { date: 'desc' } })
  const messages = await prisma.contactMessage.findMany({ orderBy: { date: 'desc' } })

  return NextResponse.json({ products, orders, messages })
}

// POST: Add a new product
export async function POST(request: Request) {
  const body = await request.json()
  
  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      stock: parseInt(body.stock || '0'), 
      brand: body.brand,
      // Updated to match schema (plural)
      images: body.images, 
    },
  })
  return NextResponse.json(newProduct)
}

// PUT: Update a product price
export async function PUT(request: Request) {
  const body = await request.json()
  const updatedProduct = await prisma.product.update({
    where: { id: body.id },
    data: { price: parseFloat(body.price) },
  })
  return NextResponse.json(updatedProduct)
}

// DELETE: Remove a product
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (id) {
    await prisma.product.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'No ID' }, { status: 400 })
}