"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  subscriptionTier: string
  subscriptionStatus: string
  subscriptionEndDate: string | null
  _count: {
    menuItems: number
    categories: number
    qrCodes: number
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    primaryColor: "#4F46E5",
    secondaryColor: "#818CF8",
  })

  useEffect(() => {
    if (session?.user?.restaurantId) {
      fetchRestaurant()
    }
  }, [session])

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants/${session?.user?.restaurantId}`)
      const data = await res.json()
      if (res.ok) {
        setRestaurant(data.restaurant)
        setFormData({
          name: data.restaurant.name,
          logoUrl: data.restaurant.logoUrl || "",
          primaryColor: data.restaurant.primaryColor || "#4F46E5",
          secondaryColor: data.restaurant.secondaryColor || "#818CF8",
        })
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/restaurants/${session?.user?.restaurantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          logoUrl: formData.logoUrl || null,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
        }),
      })

      if (res.ok) {
        alert('Ayarlar kaydedildi!')
        fetchRestaurant()
      } else {
        const data = await res.json()
        alert(data.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Kaydederken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  if (!restaurant) {
    return <div className="text-center py-8">Restoran bilgisi bulunamadı</div>
  }

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'STARTER': return 'Starter (500₺/ay)'
      case 'PROFESSIONAL': return 'Professional (1500₺/ay)'
      case 'ENTERPRISE': return 'Enterprise (2500₺/ay)'
      default: return tier
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Restoran bilgilerinizi yönetin</p>
      </div>

      {/* Subscription Info */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">Abonelik Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Paket:</span>
            <span className="font-semibold text-indigo-900">{getTierName(restaurant.subscriptionTier)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Durum:</span>
            <span className={`font-semibold ${restaurant.subscriptionStatus === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
              {restaurant.subscriptionStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'}
            </span>
          </div>
          {restaurant.subscriptionEndDate && (
            <div className="flex justify-between">
              <span className="text-gray-700">Bitiş Tarihi:</span>
              <span className="font-semibold text-gray-900">
                {new Date(restaurant.subscriptionEndDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Ürün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurant._count.menuItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Kategoriler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurant._count.categories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              QR Kodlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurant._count.qrCodes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Restoran Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restoran Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug (Değiştirilemez)</Label>
              <Input
                id="slug"
                value={restaurant.slug}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">
                Menü URL: /menu/{restaurant.slug}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500">
                QR menüde görünecek logo URL'i
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Ana Renk</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#4F46E5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">İkincil Renk</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#818CF8"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
