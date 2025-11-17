import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateRecipeSchema = z.object({
  quantity: z.number().min(0).optional(),
  unit: z.enum(['KG', 'G', 'L', 'ML', 'ADET']).optional(),
})

// Reçete itemini güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; recipeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateRecipeSchema.parse(body)

    // Recipe kontrolü
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.recipeId },
      include: {
        menuItem: true
      }
    })

    if (!recipe || recipe.menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Güncelle
    const updatedRecipe = await prisma.recipe.update({
      where: { id: params.recipeId },
      data,
      include: {
        ingredient: true
      }
    })

    // Maliyeti yeniden hesapla
    await recalculateItemCost(params.id)

    return NextResponse.json({ recipe: updatedRecipe })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Recipe update error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Reçeteden malzemeyi çıkar
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; recipeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Recipe kontrolü
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.recipeId },
      include: {
        menuItem: true
      }
    })

    if (!recipe || recipe.menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Sil
    await prisma.recipe.delete({
      where: { id: params.recipeId }
    })

    // Maliyeti yeniden hesapla
    await recalculateItemCost(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recipe deletion error:', error)
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
    const ingredientPrice = recipe.ingredient.currentPrice
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
