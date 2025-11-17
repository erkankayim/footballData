import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const menuItemSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  nameRu: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionRu: z.string().optional(),
  price: z.number().min(0),
  cost: z.number().min(0).optional(),
  imageUrl: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  calories: z.number().optional(),
  preparationTime: z.number().optional(),
  isAvailable: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')

    const where: any = {
      restaurantId: session.user.restaurantId
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ menuItems })
  } catch (error) {
    console.error('Menu items fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = menuItemSchema.parse(body)

    // Kategori kontrolü
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category || category.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Kar marjı hesapla
    let profitMargin = null
    if (data.cost && data.cost > 0) {
      profitMargin = ((data.price - data.cost) / data.price) * 100
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        ...data,
        profitMargin,
        restaurantId: session.user.restaurantId,
        imageUrl: data.imageUrl || [],
        allergens: data.allergens || [],
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

    console.error('Menu item creation error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
