"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, QrCode, TrendingUp, AlertTriangle } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalViews: number
    qrScans: number
    topViewedCount: number
    lowProfitCount: number
  }
  topViewedItems: Array<{
    id: string
    name: string
    viewCount: number
    price: number
    category: { name: string }
  }>
  topProfitItems: Array<{
    id: string
    name: string
    price: number
    cost: number
    profitMargin: number
    category: { name: string }
  }>
  lowProfitItems: Array<{
    id: string
    name: string
    price: number
    cost: number
    profitMargin: number
    category: { name: string }
  }>
  dailyViews: Array<{
    date: string
    count: number
  }>
  categoryViews: Array<{
    category: string
    count: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?period=${period}`)
      const result = await res.json()
      if (res.ok) {
        setData(result)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  if (!data) {
    return <div className="text-center py-8">Veri bulunamadı</div>
  }

  const stats = [
    {
      title: "Toplam Görüntüleme",
      value: data.overview.totalViews,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "QR Tarama",
      value: data.overview.qrScans,
      icon: QrCode,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Popüler Ürünler",
      value: data.overview.topViewedCount,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Düşük Kar Uyarısı",
      value: data.overview.lowProfitCount,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Detaylı istatistikler ve raporlar</p>
        </div>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="7">Son 7 gün</option>
          <option value="30">Son 30 gün</option>
          <option value="90">Son 90 gün</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Low Profit Warning */}
      {data.lowProfitItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Düşük Kar Marjlı Ürünler (%30'un Altında)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.lowProfitItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      %{item.profitMargin.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.price}₺ - Maliyet: {item.cost}₺
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Viewed Items */}
        <Card>
          <CardHeader>
            <CardTitle>En Çok Görüntülenen Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topViewedItems.length === 0 ? (
              <p className="text-gray-600 text-sm">Henüz görüntüleme verisi yok</p>
            ) : (
              <div className="space-y-3">
                {data.topViewedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-indigo-600">
                        {item.viewCount} görüntüleme
                      </p>
                      <p className="text-xs text-gray-500">{item.price}₺</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Profit Items */}
        <Card>
          <CardHeader>
            <CardTitle>En Karlı Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProfitItems.length === 0 ? (
              <p className="text-gray-600 text-sm">Henüz maliyet verisi yok</p>
            ) : (
              <div className="space-y-3">
                {data.topProfitItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        %{item.profitMargin.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Kar: {(item.price - item.cost).toFixed(2)}₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Views */}
      {data.categoryViews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kategori Bazlı Görüntüleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.categoryViews.map((cat) => {
                const total = data.categoryViews.reduce((sum, c) => sum + Number(c.count), 0)
                const percentage = total > 0 ? (Number(cat.count) / total) * 100 : 0

                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {cat.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {cat.count} (%{percentage.toFixed(1)})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
