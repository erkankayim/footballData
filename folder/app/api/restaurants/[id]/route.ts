import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (params.id !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            menuItems: true,
            categories: true,
            qrCodes: true,
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error('Restaurant fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (params.id !== session.user.restaurantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const data = updateRestaurantSchema.parse(body)

    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json({ restaurant })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Restaurant update error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
