import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(categories)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST: Add new category
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newCategory = await prisma.category.create({
      data: { name: body.name }
    })
    return NextResponse.json(newCategory)
  } catch (e) {
    return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
  }
}

// PUT: Rename category
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const updated = await prisma.category.update({
      where: { id: body.id },
      data: { name: body.name }
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE: Remove category
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    await prisma.category.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'ID missing' }, { status: 400 })
}