import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    const formatted = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }))
    return NextResponse.json(formatted)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        category: body.category,
        brand: body.brand,
        stock: parseInt(body.stock), // <--- NEW: Save Stock
        images: JSON.stringify(body.images)
      }
    })
    return NextResponse.json(newProduct)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const updated = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        price: parseFloat(body.price),
        category: body.category,
        brand: body.brand,
        stock: parseInt(body.stock), // <--- NEW: Update Stock
        images: JSON.stringify(body.images)
      }
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (id) {
      await prisma.product.delete({ where: { id: parseInt(id) } })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'ID missing' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}