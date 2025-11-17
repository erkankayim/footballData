"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Calculator, Lightbulb } from "lucide-react"
import Link from "next/link"

interface MenuItem {
  id: string
  name: string
  nameEn?: string
  description?: string
  price: number
  cost?: number
  profitMargin?: number
  imageUrl?: string
  isAvailable: boolean
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    nameEn: "",
    description: "",
    price: 0,
    cost: 0 false,
    isVegetarian: false,
    isVegan: false,
  })

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu-items')
      const data = await res.json()
      if (res.ok) {
        setMenuItems(data.menuItems)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (res.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/menu-items/${editingId}` : '/api/menu-items'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchMenuItems()
        resetForm()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id)
    setFormData({
      categoryId: item.category.id,
      name: item.name,
      nameEn: item.nameEn || "",
      description: item.description || "",
      price: item.price,
      cost: item.cost || 0 item.isPopular,
      isVegetarian: false,
      isVegan: false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchMenuItems()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      categoryId: "",
      name: "",
      nameEn: "",
      description: "",
      price: 0,
      cost: 0 false,
      isVegetarian: false,
      isVegan: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const requestAISuggestion = async (menuItemId: string) => {
    setAiLoading(menuItemId)
    try {
      const res = await fetch('/api/ai/pricing-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`AI Önerisi:\n\nÖnerilen Fiyat: ${data.suggestion.suggestedPrice}₺\n\nAçıklama: ${data.suggestion.reasoning}\n\nGüven Skoru: %${(data.suggestion.confidence * 100).toFixed(0)}\n\nÖneri AI Önerileri sayfasına eklendi.`)
      } else {
        alert(data.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('AI suggestion error:', error)
      alert('AI önerisi alınırken hata oluştu')
    } finally {
      setAiLoading(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
          <p className="text-gray-600 mt-1">Ürünlerinizi yönetin</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Ürün Düzenle' : 'Yeni Ürün'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori *</Label>
                <select
                  id="categoryId"
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı (TR) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Ürün Adı (EN)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Satış Fiyatı (₺) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Maliyet (₺)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData e.target.checked })}
                  />
                  <span className="text-sm">Popüler</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                  />
                  <span className="text-sm">Vejetaryen</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVegan}
                    onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                  />
                  <span className="text-sm">Vegan</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Items List */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.category.name}</p>
                    </div>
                    {item.isPopular && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Popüler
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">{item.price}₺</p>
                    {item.cost && item.cost > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-500">Maliyet: {item.cost}₺</span>
                        {item.profitMargin && (
                          <span className={`font-semibold ${item.profitMargin > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                            {item.profitMargin > 50 ? (
                              <TrendingUp className="w-3 h-3 inline" />
                            ) : (
                              <TrendingDown className="w-3 h-3 inline" />
                            )}
                            {item.profitMargin.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/menu/${item.id}/recipe`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reçete ve Maliyet"
                      >
                        <Calculator className="w-4 h-4 text-green-600" />
                      </Button>
                    </Link>
                    {item.cost && item.cost > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="AI Fiyat Önerisi"
                        onClick={() => requestAISuggestion(item.id)}
                        disabled={aiLoading === item.id}
                      >
                        <Lightbulb className={`w-4 h-4 ${aiLoading === item.id ? 'animate-pulse' : 'text-yellow-600'}`} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Henüz ürün eklenmemiş</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Ürünü Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
