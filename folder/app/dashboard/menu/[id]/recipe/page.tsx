"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft, Calculator } from "lucide-react"

interface RecipeItem {
  id: string
  ingredient: {
    id: string
    name: string
    unit: string
    pricePerUnit: number
  }
  quantity: number
  unit: string
  cost: number
}

interface MenuItem {
  id: string
  name: string
  price: number
  cost: number | null
  profitMargin: number | null
}

interface Ingredient {
  id: string
  name: string
  unit: string
  pricePerUnit: number
}

const UNITS = [
  { value: 'KG', label: 'Kilogram (kg)' },
  { value: 'G', label: 'Gram (g)' },
  { value: 'L', label: 'Litre (L)' },
  { value: 'ML', label: 'Mililitre (ml)' },
  { value: 'ADET', label: 'Adet' },
]

export default function RecipePage() {
  const params = useParams()
  const router = useRouter()
  const menuItemId = params.id as string

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [recipes, setRecipes] = useState<RecipeItem[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    ingredientId: "",
    quantity: 0,
    unit: "G",
  })

  useEffect(() => {
    fetchRecipe()
    fetchIngredients()
  }, [menuItemId])

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`/api/menu-items/${menuItemId}/recipe`)
      const data = await res.json()
      if (res.ok) {
        setRecipes(data.recipes)
        setTotalCost(data.totalCost)
        setMenuItem(data.menuItem)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients')
      const data = await res.json()
      if (res.ok) {
        setIngredients(data.ingredients)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/menu-items/${menuItemId}/recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchRecipe()
        resetForm()
      } else {
        const data = await res.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Bu malzemeyi reçeteden çıkarmak istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/menu-items/${menuItemId}/recipe/${recipeId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchRecipe()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      ingredientId: "",
      quantity: 0,
      unit: "G",
    })
    setShowForm(false)
  }

  const getProfitMarginColor = (margin: number | null) => {
    if (!margin) return 'text-gray-600'
    if (margin > 70) return 'text-green-600'
    if (margin > 50) return 'text-green-500'
    if (margin > 30) return 'text-orange-500'
    return 'text-red-600'
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  if (!menuItem) {
    return <div className="text-center py-8">Ürün bulunamadı</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/menu')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{menuItem.name} - Reçete</h1>
          <p className="text-gray-600 mt-1">Malzeme maliyetini hesaplayın</p>
        </div>
      </div>

      {/* Cost Summary */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Satış Fiyatı</p>
              <p className="text-2xl font-bold text-indigo-900">{menuItem.price.toFixed(2)}₺</p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Toplam Maliyet</p>
              <p className="text-2xl font-bold text-indigo-900">{totalCost.toFixed(2)}₺</p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Kar</p>
              <p className="text-2xl font-bold text-indigo-900">
                {(menuItem.price - totalCost).toFixed(2)}₺
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Kar Marjı</p>
              <p className={`text-2xl font-bold ${getProfitMarginColor(menuItem.profitMargin)}`}>
                {menuItem.profitMargin ? menuItem.profitMargin.toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Ingredient Form */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Malzeme Ekle
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Reçeteye Malzeme Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="ingredientId">Malzeme *</Label>
                  <select
                    id="ingredientId"
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={formData.ingredientId}
                    onChange={(e) => setFormData({ ...formData, ingredientId: e.target.value })}
                    required
                  >
                    <option value="">Malzeme Seçin</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.pricePerUnit}₺/{ing.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Miktar *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
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
              <div className="flex gap-2">
                <Button type="submit">
                  <Calculator className="w-4 h-4 mr-2" />
                  Ekle ve Hesapla
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recipe Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Reçete Malzemeleri</CardTitle>
        </CardHeader>
        <CardContent>
          {recipes.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>Henüz malzeme eklenmemiş</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Malzemeyi Ekle
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{recipe.ingredient.name}</h4>
                    <p className="text-sm text-gray-600">
                      {recipe.quantity} {recipe.unit} × {recipe.ingredient.pricePerUnit}₺/{recipe.ingredient.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{recipe.cost.toFixed(2)}₺</p>
                      <p className="text-xs text-gray-500">Maliyet</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
