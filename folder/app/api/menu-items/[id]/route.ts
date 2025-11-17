import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const menuItemSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  nameRu: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionRu: z.string().optional(),
  price: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  calories: z.number().optional(),
  preparationTime: z.number().optional(),
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        variants: true,
        recipes: {
          include: {
            ingredient: true
          }
        }
      }
    })

    if (!menuItem || menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error('Menu item fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = menuItemSchema.parse(body)

    // Ürün kontrolü
    const existing = await prisma.menuItem.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Fiyat değişimini kaydet
    if (data.price && data.price !== existing.price) {
      await prisma.priceHistory.create({
        data: {
          menuItemId: params.id,
          oldPrice: existing.price,
          newPrice: data.price,
          changedBy: session.user.id,
          reason: 'Manuel değişiklik'
        }
      })
    }

    // Kar marjı hesapla
    let profitMargin = existing.profitMargin
    const price = data.price ?? existing.price
    const cost = data.cost ?? existing.cost

    if (cost && cost > 0) {
      profitMargin = ((price - cost) / price) * 100
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        ...data,
        profitMargin,
      },
      include: {
        category: true,
        variants: true,
      }
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Menu item update error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ürün kontrolü
    const existing = await prisma.menuItem.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.menuItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Menu item deletion error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
