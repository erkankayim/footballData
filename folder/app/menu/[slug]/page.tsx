"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  allergens: string | null
  calories: number | null
  isVegetarian: boolean
  isVegan: boolean
  variants: { id: string; name: string; price: number }[]
}

interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  items: MenuItem[]
}

interface MenuData {
  restaurant: {
    name: string
    logo: string | null
    primaryColor: string | null
    secondaryColor: string | null
  }
  categories: Category[]
}

export default function MenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const qr = searchParams.get('qr')
  const [lang, setLang] = useState('tr')

  const [menu, setMenu] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchMenu()
  }, [slug, lang])

  useEffect(() => {
    // Track menü görüntüleme
    if (menu) {
      trackView()
    }
  }, [menu])

  const trackView = async () => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantSlug: slug,
          qrCodeId: qr || null,
        }),
      })
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }

  const fetchMenu = async () => {
    try {
      const url = `/api/menu/${slug}?lang=${lang}${qr ? `&qr=${qr}` : ''}`
      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        setMenu(data)
        if (data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id)
        }
      }
    } catch (error) {
      console.error('Menu fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Menü yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menü Bulunamadı</h1>
          <p className="text-gray-600">Bu restoran mevcut değil</p>
        </div>
      </div>
    )
  }

  const selectedCat = menu.categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="sticky top-0 z-50 bg-white shadow-sm"
        style={{ borderBottom: `3px solid ${menu.restaurant.primaryColor || '#4F46E5'}` }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {menu.restaurant.logo && (
                <img
                  src={menu.restaurant.logo}
                  alt={menu.restaurant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {menu.restaurant.name}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('tr')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  lang === 'tr' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  lang === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {menu.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
                }`}
              >
                {cat.icon && <span className="mr-2">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        {selectedCat && (
          <>
            {selectedCat.description && (
              <p className="text-gray-600 mb-6">{selectedCat.description}</p>
            )}
            <div className="space-y-4">
              {selectedCat.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      {item.imageUrl && (
                        <div className="w-28 h-28 flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {item.isVegan && <span>🌱 Vegan</span>}
                              {item.isVegetarian && <span>🥬 Vejetaryen</span>}
                              {item.calories && <span>{item.calories} kcal</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-lg font-bold"
                              style={{ color: menu.restaurant.primaryColor || '#4F46E5' }}
                            >
                              {item.price}₺
                            </p>
                          </div>
                        </div>

                        {/* Variants */}
                        {item.variants && item.variants.length > 0 && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {item.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                              >
                                {variant.name}: {variant.price}₺
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Allergens */}
                        {item.allergens && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-medium">Alerjenler:</span>{' '}
                            {item.allergens}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        Powered by <span className="font-semibold text-indigo-600">MenuMaster AI</span>
      </div>
    </div>
  )
}
