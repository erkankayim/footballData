import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { generatePricingSuggestion } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { menuItemId } = body

    // Ürün bilgisini al
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        category: true,
      }
    })

    if (!menuItem || menuItem.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!menuItem.cost || menuItem.cost === 0) {
      return NextResponse.json(
        { error: 'Bu ürün için maliyet bilgisi girilmemiş. Önce reçete oluşturun.' },
        { status: 400 }
      )
    }

    // Rakip fiyatlarını al
    const competitorPrices = await prisma.competitorPrice.findMany({
      where: {
        matchedMenuItemId: menuItemId
      },
      select: {
        price: true
      }
    })

    // AI önerisi al
    const suggestion = await generatePricingSuggestion({
      itemName: menuItem.name,
      currentPrice: menuItem.price,
      cost: menuItem.cost,
      competitorPrices: competitorPrices.map(c => c.price),
      viewCount: menuItem.viewCount,
    })

    // AI önerisini kaydet
    const aiSuggestion = await prisma.aISuggestion.create({
      data: {
        restaurantId: session.user.restaurantId,
        suggestionType: 'PRICE_CHANGE',
        title: `${menuItem.name} için fiyat önerisi`,
        description: suggestion.reasoning,
        confidenceScore: suggestion.confidence,
        estimatedRevenueImpact: parseFloat(suggestion.expectedImpact.replace(/[^0-9.-]/g, '')) || 0,
        status: 'PENDING',
        metadata: {
          menuItemId,
          currentPrice: menuItem.price,
          suggestedPrice: suggestion.suggestedPrice,
        }
      }
    })

    return NextResponse.json({
      suggestion: {
        ...suggestion,
        id: aiSuggestion.id,
      }
    })
  } catch (error) {
    console.error('AI suggestion error:', error)
    return NextResponse.json(
      { error: 'AI önerisi oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
