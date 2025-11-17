import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const searchParams = req.nextUrl.searchParams
    const qrCode = searchParams.get('qr')
    const lang = searchParams.get('lang') || 'tr'

    // Restaurant'ı bul
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            menuItems: {
              where: { isAvailable: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                variants: {
                  where: { isAvailable: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // QR kod varsa scan count artır
    if (qrCode) {
      await prisma.qRCode.updateMany({
        where: {
          code: qrCode,
          restaurantId: restaurant.id
        },
        data: {
          totalViews: {
            increment: 1
          }
        }
      })
    }

    // Dil desteği için field seçimi
    const getLocalizedField = (item: any, field: string) => {
      if (lang === 'en' && item[`${field}En`]) return item[`${field}En`]
      if (lang === 'ar' && item[`${field}Ar`]) return item[`${field}Ar`]
      if (lang === 'ru' && item[`${field}Ru`]) return item[`${field}Ru`]
      return item[field]
    }

    // Response formatla
    const menu = {
      restaurant: {
        name: restaurant.name,
        logo: restaurant.logoUrl,
        primaryColor: restaurant.primaryColor,
        secondaryColor: restaurant.secondaryColor,
      },
      categories: restaurant.categories.map(cat => ({
        id: cat.id,
        name: getLocalizedField(cat, 'name'),
        description: cat.description,
        icon: cat.icon,
        items: cat.menuItems.map(item => ({
          id: item.id,
          name: getLocalizedField(item, 'name'),
          description: getLocalizedField(item, 'description'),
          price: item.price,
          images: item.images,
          allergens: item.allergens,
          calories: item.calories,
          isPopular: item.isPopular,
          isNew: item.isNew,
          isSpicy: item.isSpicy,
          isVegetarian: item.isVegetarian,
          isVegan: item.isVegan,
          variants: item.variants.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
          }))
        }))
      }))
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Menu fetch error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
