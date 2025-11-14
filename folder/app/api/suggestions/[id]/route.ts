import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Öneriyi kabul et
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body // 'accept' or 'reject'

    const suggestion = await prisma.aISuggestion.findUnique({
      where: { id: params.id }
    })

    if (!suggestion || suggestion.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (action === 'accept') {
      // Öneriyi uygula
      const metadata = suggestion.metadata as any

      if (suggestion.suggestionType === 'PRICE_CHANGE' && metadata.menuItemId) {
        // Fiyatı güncelle
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: metadata.menuItemId }
        })

        if (menuItem) {
          // Fiyat geçmişine kaydet
          await prisma.priceHistory.create({
            data: {
              menuItemId: metadata.menuItemId,
              oldPrice: menuItem.price,
              newPrice: metadata.suggestedPrice,
              changedBy: session.user.id,
              reason: 'AI önerisi kabul edildi'
            }
          })

          // Fiyatı güncelle
          await prisma.menuItem.update({
            where: { id: metadata.menuItemId },
            data: {
              price: metadata.suggestedPrice,
              profitMargin: menuItem.cost
                ? ((metadata.suggestedPrice - menuItem.cost) / metadata.suggestedPrice) * 100
                : null
            }
          })
        }
      }

      // Öneriyi "uygulandı" olarak işaretle
      await prisma.aISuggestion.update({
        where: { id: params.id },
        data: {
          status: 'APPLIED',
          appliedAt: new Date(),
          appliedBy: session.user.id,
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
