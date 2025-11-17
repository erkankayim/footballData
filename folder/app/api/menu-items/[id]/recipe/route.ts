import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const recipeItemSchema = z.object({
  ingredientId: z.string(),
  quantity: z.number().min(0),
  unit: z.enum(['KG', 'G', 'L', 'ML', 'ADET']),
})

// Reçeteyi getir
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Menü item kontrolü
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id }
    })

    if (!menuItem || menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const recipes = await prisma.recipe.findMany({
      where: { menuItemId: params.id },
      include: {
        ingredient: true
      }
    })

    // Toplam maliyet hesapla
    let totalCost = 0
    const recipeDetails = recipes.map(recipe => {
      let cost = 0
      const ingredientPrice = recipe.ingredient.pricePerUnit

      // Birim dönüşümü
      if (recipe.ingredient.unit === 'KG' && recipe.unit === 'G') {
        cost = (ingredientPrice / 1000) * recipe.quantity
      } else if (recipe.ingredient.unit === 'L' && recipe.unit === 'ML') {
        cost = (ingredientPrice / 1000) * recipe.quantity
      } else if (recipe.ingredient.unit === recipe.unit) {
        cost = ingredientPrice * recipe.quantity
      }

      totalCost += cost

      return {
        id: recipe.id,
        ingredient: {
          id: recipe.ingredient.id,
          name: recipe.ingredient.name,
          unit: recipe.ingredient.unit,
          pricePerUnit: recipe.ingredient.pricePerUnit,
        },
        quantity: recipe.quantity,
        unit: recipe.unit,
        cost: cost,
      }
    })

    return NextResponse.json({
      recipes: recipeDetails,
      totalCost,
      menuItem: {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        cost: menuItem.cost,
        profitMargin: menuItem.profitMargin,
      }
    })
  } catch (error) {
    console.error('Recipe fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Reçeteye malzeme ekle
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = recipeItemSchema.parse(body)

    // Menü item kontrolü
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id }
    })

    if (!menuItem || menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Malzeme kontrolü
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: data.ingredientId }
    })

    if (!ingredient || ingredient.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Invalid ingredient' }, { status: 400 })
    }

    // Zaten var mı kontrol et
    const existing = await prisma.recipe.findFirst({
      where: {
        menuItemId: params.id,
        ingredientId: data.ingredientId
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu malzeme zaten reçetede mevcut' },
        { status: 400 }
      )
    }

    // Reçete oluştur
    const recipe = await prisma.recipe.create({
      data: {
        menuItemId: params.id,
        ingredientId: data.ingredientId,
        quantity: data.quantity,
        unit: data.unit,
      },
      include: {
        ingredient: true
      }
    })

    // Maliyeti yeniden hesapla
    await recalculateItemCost(params.id)

    return NextResponse.json({ recipe })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Recipe creation error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Maliyet hesaplama fonksiyonu
async function recalculateItemCost(menuItemId: string) {
  const recipes = await prisma.recipe.findMany({
    where: { menuItemId },
    include: { ingredient: true }
  })

  let totalCost = 0

  for (const recipe of recipes) {
    const ingredientPrice = recipe.ingredient.pricePerUnit
    const quantity = recipe.quantity

    // Birim dönüşümü
    let costPerUnit = ingredientPrice
    if (recipe.ingredient.unit === 'KG' && recipe.unit === 'G') {
      costPerUnit = ingredientPrice / 1000
    } else if (recipe.ingredient.unit === 'L' && recipe.unit === 'ML') {
      costPerUnit = ingredientPrice / 1000
    }

    totalCost += costPerUnit * quantity
  }

  // Menü item'ı güncelle
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId }
  })

  if (menuItem) {
    const profitMargin = menuItem.price > 0
      ? ((menuItem.price - totalCost) / menuItem.price) * 100
      : 0

    await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        cost: totalCost,
        profitMargin: profitMargin
      }
    })
  }
}
