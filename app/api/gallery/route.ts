import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Fetch all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(images)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST: Upload new image
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newImage = await prisma.galleryImage.create({
      data: { url: body.url }
    })
    return NextResponse.json(newImage)
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// DELETE: Remove image
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    await prisma.galleryImage.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'ID missing' }, { status: 400 })
}