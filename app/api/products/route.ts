import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 1. GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // FIX: Removed JSON.parse mapping because 'images' is now already an array (String[])
    return NextResponse.json(products)
    
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

// 2. POST: Create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        category: body.category,
        stock: parseInt(body.stock),
        brand: body.brand,
        images: body.images // Pass array directly
      }
    })
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}

// 3. PUT: Update a product
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const updated = await prisma.product.update({
        where: { id: body.id },
        data: {
            name: body.name,
            price: parseFloat(body.price),
            stock: parseInt(body.stock),
            category: body.category,
            brand: body.brand,
            images: body.images
        }
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}

// 4. DELETE: Remove a product
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if(id) {
        await prisma.product.delete({ where: { id: Number(id) }})
        return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'ID missing'}, { status: 400 })
}