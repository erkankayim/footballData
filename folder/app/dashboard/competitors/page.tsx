"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"

interface Competitor {
  name: string
  url: string | null
  products: Array<{
    id: string
    productName: string
    price: number
    platform: string
    matchedMenuItem: {
      id: string
      name: string
      price: number
    } | null
    scrapedAt: string
  }>
}

interface MenuItem {
  id: string
  name: string
  price: number
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    competitorName: "",
    competitorUrl: "",
    productName: "",
    price: 0,
    matchedMenuItemId: "",
    platform: "MANUAL",
  })

  useEffect(() => {
    fetchCompetitors()
    fetchMenuItems()
  }, [])

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/competitors')
      const data = await res.json()
      if (res.ok) {
        setCompetitors(data.competitors)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu-items')
      const data = await res.json()
      if (res.ok) {
        setMenuItems(data.menuItems)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchCompetitors()
        resetForm()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rakip fiyatını silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/competitors/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCompetitors()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      competitorName: "",
      competitorUrl: "",
      productName: "",
      price: 0,
      matchedMenuItemId: "",
      platform: "MANUAL",
    })
    setShowForm(false)
  }

  const getPriceDifference = (ourPrice: number, competitorPrice: number) => {
    const diff = ourPrice - competitorPrice
    const percentage = (diff / competitorPrice) * 100
    return { diff, percentage }
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rakip Analizi</h1>
          <p className="text-gray-600 mt-1">Rakip fiyatlarını takip edin ve karşılaştırın</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Rakip Fiyat Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Rakip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Ürün Karşılaştırması
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitors.reduce((sum, c) => sum + c.products.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Eşleştirilmiş Ürün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitors.reduce((sum, c) =>
                sum + c.products.filter(p => p.matchedMenuItem).length, 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Rakip Fiyat Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="competitorName">Rakip Adı *</Label>
                  <Input
                    id="competitorName"
                    value={formData.competitorName}
                    onChange={(e) => setFormData({ ...formData, competitorName: e.target.value })}
                    placeholder="Rakip Restoran Adı"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitorUrl">Rakip URL</Label>
                  <Input
                    id="competitorUrl"
                    type="url"
                    value={formData.competitorUrl}
                    onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                    placeholder="https://yemeksepeti.com/restoran/..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Ürün Adı *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="Hamburger, Pizza, vb."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Fiyat (₺) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchedMenuItemId">Sizin Ürününüz (Opsiyonel)</Label>
                  <select
                    id="matchedMenuItemId"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.matchedMenuItemId}
                    onChange={(e) => setFormData({ ...formData, matchedMenuItemId: e.target.value })}
                  >
                    <option value="">Eşleştirme yok</option>
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.price}₺)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="MANUAL">Manuel</option>
                    <option value="YEMEKSEPETI">Yemeksepeti</option>
                    <option value="GETIR">Getir</option>
                    <option value="WEBSITE">Website</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Kaydet</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Competitors List */}
      {competitors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Henüz rakip fiyatı eklenmemiş</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Rakibi Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {competitors.map((competitor, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{competitor.name}</CardTitle>
                    {competitor.url && (
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Siteyi Ziyaret Et
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {competitor.products.length} ürün
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {competitor.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.productName}</h4>
                        {product.matchedMenuItem && (
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className="text-gray-600">
                              Sizin: <strong>{product.matchedMenuItem.name}</strong>
                            </span>
                            <span className="text-gray-600">
                              Sizin Fiyat: <strong className="text-indigo-600">{product.matchedMenuItem.price}₺</strong>
                            </span>
                            {(() => {
                              const { diff, percentage } = getPriceDifference(
                                product.matchedMenuItem.price,
                                product.price
                              )
                              return (
                                <span className={`flex items-center gap-1 font-semibold ${
                                  diff > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {diff > 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  {diff > 0 ? '+' : ''}{diff.toFixed(2)}₺ ({percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%)
                                </span>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{product.price}₺</p>
                          <p className="text-xs text-gray-500">
                            {new Date(product.scrapedAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
