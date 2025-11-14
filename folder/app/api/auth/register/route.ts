import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  restaurantName: z.string().min(2),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, fullName, restaurantName, phone } = registerSchema.parse(body)

    // Email zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const passwordHash = await hash(password, 12)

    // Restoran slug oluştur
    const slug = restaurantName
      .toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Math.random().toString(36).substring(2, 7)

    // Transaction ile restoran ve kullanıcı oluştur
    const result = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          slug,
          subscriptionTier: 'STARTER',
          subscriptionStatus: 'ACTIVE',
          subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 gün deneme
        }
      })

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone,
          role: 'OWNER',
          restaurantId: restaurant.id,
        }
      })

      return { user, restaurant }
    })

    return NextResponse.json({
      message: 'Hesap başarıyla oluşturuldu',
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
      restaurant: {
        id: result.restaurant.id,
        name: result.restaurant.name,
        slug: result.restaurant.slug,
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
