import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Öneriyi kabul et
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
    const { action } = body // 'accept' or 'reject'

    const suggestion = await prisma.aISuggestion.findUnique({
      where: { id: params.id },
      include: {
        menuItem: true
      }
    })

    if (!suggestion || suggestion.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (action === 'accept') {
      // Fiyat geçmişine kaydet
      await prisma.priceHistory.create({
        data: {
          menuItemId: suggestion.menuItemId,
          oldPrice: suggestion.currentPrice,
          newPrice: suggestion.suggestedPrice,
          changedBy: session.user.id,
          reason: 'AI önerisi kabul edildi'
        }
      })

      // Fiyatı güncelle
      await prisma.menuItem.update({
        where: { id: suggestion.menuItemId },
        data: {
          price: suggestion.suggestedPrice,
          profitMargin: suggestion.menuItem.cost
            ? ((suggestion.suggestedPrice - suggestion.menuItem.cost) / suggestion.suggestedPrice) * 100
            : null
        }
      })

      // Öneriyi "uygulandı" olarak işaretle
      await prisma.aISuggestion.update({
        where: { id: params.id },
        data: {
          status: 'APPLIED',
          appliedAt: new Date(),
          appliedById: session.user.id,
        }
      })

      return NextResponse.json({ success: true, message: 'Öneri başarıyla uygulandı' })
    } else if (action === 'reject') {
      // Öneriyi reddet
      await prisma.aISuggestion.update({
        where: { id: params.id },
        data: {
          status: 'REJECTED',
        }
      })

      return NextResponse.json({ success: true, message: 'Öneri reddedildi' })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Suggestion action error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
