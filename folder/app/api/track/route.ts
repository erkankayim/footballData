import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { qrCodeId, menuItemId, restaurantSlug } = body

    // Restaurant ID bul
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: restaurantSlug },
      select: { id: true }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // IP ve User Agent bilgilerini al
    const userAgent = req.headers.get('user-agent') || undefined
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || undefined

    // MenuView kaydı oluştur
    await prisma.menuView.create({
      data: {
        qrCodeId: qrCodeId || null,
        menuItemId: menuItemId || null,
        userAgent,
        ipAddress,
      }
    })

    // QR kod varsa scan count artır
    if (qrCodeId) {
      await prisma.qRCode.updateMany({
        where: { id: qrCodeId },
        data: {
          totalViews: {
            increment: 1
          }
        }
      })
    }

    // Ürün varsa view count artır
    if (menuItemId) {
      await prisma.menuItem.updateMany({
        where: { id: menuItemId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
