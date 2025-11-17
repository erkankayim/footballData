import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(1),
  unit: z.enum(['KG', 'G', 'L', 'ML', 'ADET']),
  currentPrice: z.number().min(0),
  stockQuantity: z.number().min(0).optional(),
  minStockLevel: z.number().min(0).optional(),
  supplier: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: any = {
      restaurantId: session.user.restaurantId
    }

    // Düşük stokta olanları filtrele
    if (lowStock) {
      const ingredients = await prisma.ingredient.findMany({
        where,
        orderBy: { name: 'asc' }
      })

      const lowStockItems = ingredients.filter(
        ing => ing.minStockLevel && ing.stockQuantity < ing.minStockLevel
      )

      return NextResponse.json({ ingredients: lowStockItems })
    }

    const ingredients = await prisma.ingredient.findMany({
      where,
      include: {
        _count: {
          select: { recipes: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ ingredients })
  } catch (error) {
    console.error('Ingredients fetch error:', error)
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
    const data = ingredientSchema.parse(body)

    const ingredient = await prisma.ingredient.create({
      data: {
        ...data,
        restaurantId: session.user.restaurantId,
      }
    })

    return NextResponse.json({ ingredient })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Ingredient creation error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
