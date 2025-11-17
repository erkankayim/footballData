import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const competitorSchema = z.object({
  competitorName: z.string().min(1),
  competitorUrl: z.string().url().optional(),
  productName: z.string().min(1),
  price: z.number().min(0),
  matchedMenuItemId: z.string().optional(),
  platform: z.enum(['YEMEKSEPETI', 'GETIR', 'WEBSITE', 'MANUAL']).default('MANUAL'),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const menuItemId = searchParams.get('menuItemId')

    const where: any = {
      restaurantId: session.user.restaurantId
    }

    if (menuItemId) {
      where.matchedMenuItemId = menuItemId
    }

    const competitors = await prisma.competitorPrice.findMany({
      where,
      include: {
        matchedMenuItem: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
      orderBy: {
        scrapedAt: 'desc'
      }
    })

    // Rakip bazlı gruplama
    const competitorMap = new Map<string, any>()

    competitors.forEach(comp => {
      if (!competitorMap.has(comp.competitorName)) {
        competitorMap.set(comp.competitorName, {
          name: comp.competitorName,
          url: comp.competitorUrl,
          products: []
        })
      }

      competitorMap.get(comp.competitorName)!.products.push({
        id: comp.id,
        productName: comp.productName,
        price: comp.price,
        platform: comp.platform,
        matchedMenuItem: comp.matchedMenuItem,
        scrapedAt: comp.scrapedAt,
      })
    })

    const competitorList = Array.from(competitorMap.values())

    return NextResponse.json({
      competitors: competitorList,
      totalCompetitors: competitorList.length,
      totalProducts: competitors.length
    })
  } catch (error) {
    console.error('Competitors fetch error:', error)
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
    const data = competitorSchema.parse(body)

    // Eğer ürün eşleştirme varsa kontrol et
    if (data.matchedMenuItemId) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: data.matchedMenuItemId }
      })

      if (!menuItem || menuItem.restaurantId !== session.user.restaurantId) {
        return NextResponse.json(
          { error: 'Geçersiz ürün eşleştirmesi' },
          { status: 400 }
        )
      }
    }

    const competitor = await prisma.competitorPrice.create({
      data: {
        restaurantId: session.user.restaurantId,
        competitorName: data.competitorName,
        competitorUrl: data.competitorUrl || null,
        productName: data.productName,
        price: data.price,
        matchedMenuItemId: data.matchedMenuItemId || null,
        platform: data.platform,
      },
      include: {
        matchedMenuItem: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      }
    })

    return NextResponse.json({ competitor })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Competitor creation error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
