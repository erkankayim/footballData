import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  competitorName: z.string().min(1).optional(),
  competitorUrl: z.string().url().optional(),
  productName: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  matchedMenuItemId: z.string().optional(),
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
    const data = updateSchema.parse(body)

    // Rakip kontrolü
    const existing = await prisma.competitorPrice.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const competitor = await prisma.competitorPrice.update({
      where: { id: params.id },
      data,
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

    console.error('Competitor update error:', error)
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

    // Rakip kontrolü
    const existing = await prisma.competitorPrice.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.restaurantId !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.competitorPrice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Competitor deletion error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
