import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.enum(['KG', 'G', 'L', 'ML', 'ADET']).optional(),
  currentPrice: z.number().min(0).optional(),
  stockQuantity: z.number().min(0).optional(),
  minStockLevel: z.number().min(0).optional(),
  supplier: z.string().optional(),
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
    const data = ingredientSchema.parse(body)

    // Malzeme kontrolü
    const existing = await prisma.ingredient.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const ingredient = await prisma.ingredient.update({
      where: { id: params.id },
      data
    })

    // Fiyat değişmişse, bu malzemeyi içeren tüm ürünlerin maliyetini güncelle
    if (data.currentPrice && data.currentPrice !== existing.currentPrice) {
      const recipes = await prisma.recipe.findMany({
        where: { ingredientId: params.id },
        select: { menuItemId: true }
      })

      // Her ürün için maliyet hesapla
      for (const recipe of recipes) {
        await recalculateItemCost(recipe.menuItemId)
      }
    }

    return NextResponse.json({ ingredient })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Ingredient update error:', error)
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

    // Malzeme kontrolü
    const existing = await prisma.ingredient.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { recipes: true }
        }
      }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Reçetelerde kullanılıyorsa silme
    if (existing._count.recipes > 0) {
      return NextResponse.json(
        { error: 'Bu malzeme reçetelerde kullanılıyor, önce reçetelerden çıkarın' },
        { status: 400 }
      )
    }

    await prisma.ingredient.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ingredient deletion error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Yardımcı fonksiyon: Ürün maliyetini yeniden hesapla
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
    const profitMargin = ((menuItem.price - totalCost) / menuItem.price) * 100

    await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        cost: totalCost,
        profitMargin: profitMargin
      }
    })
  }
}
