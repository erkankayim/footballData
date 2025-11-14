import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') || 'PENDING'

    const suggestions = await prisma.aISuggestion.findMany({
      where: {
        restaurantId: session.user.restaurantId,
        status: status as any,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Suggestions fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
