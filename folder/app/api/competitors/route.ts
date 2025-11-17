import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const competitorSchema = z.object({
  competitorName: z.string().min(1),
  competitorLocation: z.string().optional(),
  productName: z.string().min(1),
  price: z.number().min(0),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const competitors = await prisma.competitorPrice.findMany({
      where: {
        restaurantId: session.user.restaurantId
      },
      orderBy: {
        recordedAt: 'desc'
      }
    })

    // Rakip bazlı gruplama
    const competitorMap = new Map<string, any>()

    competitors.forEach(comp => {
      if (!competitorMap.has(comp.competitorName)) {
        competitorMap.set(comp.competitorName, {
          name: comp.competitorName,
          location: comp.competitorLocation,
          products: []
        })
      }

      competitorMap.get(comp.competitorName)!.products.push({
        id: comp.id,
        productName: comp.productName,
        price: comp.price,
        notes: comp.notes,
        recordedAt: comp.recordedAt,
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

    const competitor = await prisma.competitorPrice.create({
      data: {
        restaurantId: session.user.restaurantId,
        competitorName: data.competitorName,
        competitorLocation: data.competitorLocation || null,
        productName: data.productName,
        price: data.price,
        notes: data.notes || null,
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
