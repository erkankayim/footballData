"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react"

interface Ingredient {
  id: string
  name: string
  unit: string
  currentPrice: number
  stockQuantity: number
  minStockLevel: number | null
  supplier: string | null
  _count: {
    recipes: number
  }
}

const UNITS = [
  { value: 'KG', label: 'Kilogram (kg)' },
  { value: 'G', label: 'Gram (g)' },
  { value: 'L', label: 'Litre (L)' },
  { value: 'ML', label: 'Mililitre (ml)' },
  { value: 'ADET', label: 'Adet' },
]

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    unit: "G",
    currentPrice: 0,
    stockQuantity: 0,
    minStockLevel: 0,
    supplier: "",
  })

  useEffect(() => {
    fetchIngredients()
  }, [])

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients')
      const data = await res.json()
      if (res.ok) {
        setIngredients(data.ingredients)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/ingredients/${editingId}` : '/api/ingredients'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchIngredients()
        resetForm()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id)
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      currentPrice: ingredient.currentPrice,
      stockQuantity: ingredient.stockQuantity,
      minStockLevel: ingredient.minStockLevel || 0,
      supplier: ingredient.supplier || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu malzemeyi silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchIngredients()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      unit: "G",
      currentPrice: 0,
      stockQuantity: 0,
      minStockLevel: 0,
      supplier: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getLowStockIngredients = () => {
    return ingredients.filter(ing =>
      ing.minStockLevel && ing.stockQuantity < ing.minStockLevel
    )
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  const lowStockItems = getLowStockIngredients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Malzemeler</h1>
          <p className="text-gray-600 mt-1">Stok ve fiyat yönetimi</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Malzeme
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">Düşük Stok Uyarısı</h3>
                <p className="text-sm text-orange-800 mt-1">
                  {lowStockItems.length} malzeme minimum stok seviyesinin altında
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lowStockItems.map(item => (
                    <span key={item.id} className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded">
                      {item.name}: {item.stockQuantity}{item.unit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Malzeme Düzenle' : 'Yeni Malzeme'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Malzeme Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Domates, Un, Yumurta..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Birim *</Label>
                  <select
                    id="unit"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    {UNITS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPrice">Birim Fiyat (₺) *</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Mevcut Stok</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    step="0.01"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStockLevel">Min. Stok Seviyesi</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    step="0.01"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Tedarikçi</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Tedarikçi firma adı"
                />
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

      {/* Ingredients List */}
      <div className="grid gap-3">
        {ingredients.map((ingredient) => {
          const isLowStock = ingredient.minStockLevel && ingredient.stockQuantity < ingredient.minStockLevel

          return (
            <Card key={ingredient.id} className={isLowStock ? 'border-orange-300' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                      {isLowStock && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Düşük Stok
                        </span>
                      )}
                      {ingredient._count.recipes > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {ingredient._count.recipes} reçetede
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Fiyat: <strong>{ingredient.currentPrice}₺/{ingredient.unit}</strong></span>
                      <span>Stok: <strong>{ingredient.stockQuantity} {ingredient.unit}</strong></span>
                      {ingredient.minStockLevel && (
                        <span>Min: <strong>{ingredient.minStockLevel} {ingredient.unit}</strong></span>
                      )}
                    </div>
                    {ingredient.supplier && (
                      <p className="text-xs text-gray-500 mt-1">Tedarikçi: {ingredient.supplier}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ingredient.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {ingredients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Henüz malzeme eklenmemiş</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Malzemeyi Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
