import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const period = searchParams.get('period') || '7' // days
    const days = parseInt(period)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Toplam görüntüleme
    const totalViews = await prisma.menuView.count({
      where: {
        viewedAt: {
          gte: startDate
        },
        qrCode: {
          restaurantId: session.user.restaurantId
        }
      }
    })

    // Toplam QR tarama
    const qrScans = await prisma.qRCode.aggregate({
      where: {
        restaurantId: session.user.restaurantId
      },
      _sum: {
        scanCount: true
      }
    })

    // En çok görüntülenen ürünler
    const topViewedItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: session.user.restaurantId,
        viewCount: {
          gt: 0
        }
      },
      select: {
        id: true,
        name: true,
        viewCount: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        viewCount: 'desc'
      },
      take: 10
    })

    // En karlı ürünler
    const topProfitItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: session.user.restaurantId,
        profitMargin: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        cost: true,
        profitMargin: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        profitMargin: 'desc'
      },
      take: 10
    })

    // Düşük kar marjlı ürünler (uyarı için)
    const lowProfitItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: session.user.restaurantId,
        profitMargin: {
          not: null,
          lt: 30
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        cost: true,
        profitMargin: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        profitMargin: 'asc'
      },
      take: 5
    })

    // Günlük görüntüleme trendi (son 7 gün)
    const dailyViews = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT
        DATE(viewed_at) as date,
        COUNT(*) as count
      FROM menu_views mv
      JOIN qr_codes qr ON mv.qr_code_id = qr.id
      WHERE qr.restaurant_id = ${session.user.restaurantId}
        AND mv.viewed_at >= ${startDate}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    `

    // Kategori bazlı görüntüleme
    const categoryViews = await prisma.$queryRaw<Array<{ category: string; count: number }>>`
      SELECT
        c.name as category,
        COUNT(mv.id) as count
      FROM menu_views mv
      JOIN menu_items mi ON mv.menu_item_id = mi.id
      JOIN categories c ON mi.category_id = c.id
      WHERE mi.restaurant_id = ${session.user.restaurantId}
        AND mv.viewed_at >= ${startDate}
      GROUP BY c.name
      ORDER BY count DESC
    `

    return NextResponse.json({
      overview: {
        totalViews,
        qrScans: qrScans._sum.scanCount || 0,
        topViewedCount: topViewedItems.length,
        lowProfitCount: lowProfitItems.length,
      },
      topViewedItems,
      topProfitItems,
      lowProfitItems,
      dailyViews,
      categoryViews,
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
