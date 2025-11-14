"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, Check, X, Loader2 } from "lucide-react"

interface Suggestion {
  id: string
  suggestionType: string
  title: string
  description: string
  confidenceScore: number | null
  estimatedRevenueImpact: number | null
  status: string
  metadata: any
  createdAt: string
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    fetchSuggestions()
  }, [filter])

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`/api/suggestions?status=${filter}`)
      const data = await res.json()
      if (res.ok) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        fetchSuggestions()
      } else {
        const data = await res.json()
        alert(data.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Action error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'PRICE_CHANGE':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
    }
  }

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'text-gray-600'
    if (score > 0.8) return 'text-green-600'
    if (score > 0.6) return 'text-yellow-600'
    return 'text-orange-600'
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Önerileri</h1>
          <p className="text-gray-600 mt-1">Yapay zeka destekli optimizasyon önerileri</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'PENDING' ? 'default' : 'outline'}
            onClick={() => setFilter('PENDING')}
          >
            Bekleyen
          </Button>
          <Button
            variant={filter === 'APPLIED' ? 'default' : 'outline'}
            onClick={() => setFilter('APPLIED')}
          >
            Uygulanan
          </Button>
          <Button
            variant={filter === 'REJECTED' ? 'default' : 'outline'}
            onClick={() => setFilter('REJECTED')}
          >
            Reddedilen
          </Button>
        </div>
      </div>

      {suggestions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {filter === 'PENDING' ? 'Henüz öneri yok' : 'Bu statüde öneri bulunamadı'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Menü sayfasından ürünler için AI önerisi isteyebilirsiniz
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getSuggestionIcon(suggestion.suggestionType)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                {suggestion.confidenceScore && (
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${getConfidenceColor(suggestion.confidenceScore)}`}>
                      %{(suggestion.confidenceScore * 100).toFixed(0)} güven
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  {suggestion.metadata?.currentPrice && (
                    <div>
                      <span className="text-gray-600">Mevcut Fiyat:</span>{' '}
                      <span className="font-semibold">{suggestion.metadata.currentPrice}₺</span>
                    </div>
                  )}
                  {suggestion.metadata?.suggestedPrice && (
                    <div>
                      <span className="text-gray-600">Önerilen:</span>{' '}
                      <span className="font-semibold text-green-600">
                        {suggestion.metadata.suggestedPrice}₺
                      </span>
                    </div>
                  )}
                  {suggestion.estimatedRevenueImpact !== null && suggestion.estimatedRevenueImpact !== 0 && (
                    <div>
                      <span className="text-gray-600">Tahmini Etki:</span>{' '}
                      <span className="font-semibold text-blue-600">
                        +{suggestion.estimatedRevenueImpact.toFixed(2)}₺
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Tarih:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(suggestion.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                {suggestion.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(suggestion.id, 'accept')}
                      disabled={actionLoading === suggestion.id}
                    >
                      {actionLoading === suggestion.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Uygula
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(suggestion.id, 'reject')}
                      disabled={actionLoading === suggestion.id}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reddet
                    </Button>
                  </div>
                )}

                {suggestion.status === 'APPLIED' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Uygulandı</span>
                  </div>
                )}

                {suggestion.status === 'REJECTED' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Reddedildi</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
