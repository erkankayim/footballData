import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  nameRu: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = categorySchema.parse(body)

    // Kategori bu restorana ait mi kontrol et
    const existing = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json({ category })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Category update error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kategori bu restorana ait mi kontrol et
    const existing = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Kategoride ürün varsa silme
    if (existing._count.menuItems > 0) {
      return NextResponse.json(
        { error: 'Bu kategoride ürünler var, önce ürünleri silin veya taşıyın' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
