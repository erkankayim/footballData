import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: {
        restaurantId: session.user.restaurantId
      },
      include: {
        location: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ qrCodes })
  } catch (error) {
    console.error('QR codes fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { locationId, tableNumber } = body

    // Restaurant slug'ı al
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: session.user.restaurantId }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Benzersiz short code oluştur
    const shortCode = nanoid(8)

    // QR URL oluştur
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const menuUrl = `${baseUrl}/menu/${restaurant.slug}?qr=${shortCode}`

    // QR kod görselini oluştur
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: restaurant.primaryColor || '#000000',
        light: '#FFFFFF'
      }
    })

    // Veritabanına kaydet
    const qrCode = await prisma.qRCode.create({
      data: {
        restaurantId: session.user.restaurantId,
        locationId: locationId || null,
        tableNumber: tableNumber || null,
        qrCodeUrl: qrCodeDataUrl,
        shortUrl: shortCode,
      },
      include: {
        location: true
      }
    })

    return NextResponse.json({ qrCode })
  } catch (error) {
    console.error('QR code creation error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
