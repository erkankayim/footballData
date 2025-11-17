import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePricingSuggestion } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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

    // Rakip fiyatlarını al (genel - artık menuItem'a bağlı değil)
    const competitorPrices = await prisma.competitorPrice.findMany({
      where: {
        restaurantId: session.user.restaurantId
      },
      select: {
        price: true,
        productName: true
      }
    })

    // Benzer ürün fiyatlarını filtrele (basit keyword matching)
    const relevantPrices = competitorPrices
      .filter(cp =>
        cp.productName.toLowerCase().includes(menuItem.name.toLowerCase().split(' ')[0]) ||
        menuItem.name.toLowerCase().includes(cp.productName.toLowerCase().split(' ')[0])
      )
      .map(c => c.price)

    // AI önerisi al
    const suggestion = await generatePricingSuggestion({
      itemName: menuItem.name,
      currentPrice: menuItem.price,
      cost: menuItem.cost,
      competitorPrices: relevantPrices,
    })

    // AI önerisini kaydet
    const aiSuggestion = await prisma.aISuggestion.create({
      data: {
        restaurantId: session.user.restaurantId,
        menuItemId: menuItemId,
        currentPrice: menuItem.price,
        suggestedPrice: suggestion.suggestedPrice,
        reasoning: suggestion.reasoning,
        confidence: suggestion.confidence,
        status: 'PENDING',
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
