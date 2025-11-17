"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Download, Trash2, Eye } from "lucide-react"
import Image from "next/image"

interface QRCode {
  id: string
  tableNumber: string | null
  code: string
  code: string
  totalViews: number
  location: {
    id: string
    name: string
  } | null
  createdAt: string
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tableNumber: "",
    locationId: "",
  })

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      const res = await fetch('/api/qr-codes')
      const data = await res.json()
      if (res.ok) {
        setQrCodes(data.qrCodes)
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
      const res = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchQRCodes()
        resetForm()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu QR kodu silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/qr-codes/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchQRCodes()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleDownload = (code: string, tableNumber: string | null) => {
    const link = document.createElement('a')
    link.href = code
    link.download = `qr-${tableNumber || 'menu'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetForm = () => {
    setFormData({
      tableNumber: "",
      locationId: "",
    })
    setShowForm(false)
  }

  const getMenuUrl = (code: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/menu/your-restaurant?qr=${code}`
  }

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Kodlar</h1>
          <p className="text-gray-600 mt-1">Menü QR kodlarınızı oluşturun ve yönetin</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni QR Kod
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam QR Kod
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Tarama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes.reduce((sum, qr) => sum + qr.totalViews, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni QR Kod Oluştur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Masa / Konum Adı (Opsiyonel)</Label>
                <Input
                  id="tableNumber"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="Masa 1, Kasiyer, Dış Alan, vb."
                />
                <p className="text-xs text-gray-500">
                  Boş bırakırsanız genel menü QR kodu oluşturulur
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Oluştur</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* QR Codes List */}
      {qrCodes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Henüz QR kod oluşturulmamış</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk QR Kodu Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {qr.tableNumber || 'Genel Menü'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Image */}
                <div className="relative w-full aspect-square bg-white p-4 rounded-lg border-2 border-gray-200">
                  <img
                    src={qr.code}
                    alt={`QR - ${qr.tableNumber || 'Menü'}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{qr.totalViews} tarama</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(qr.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {/* URL */}
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded break-all">
                  {getMenuUrl(qr.code)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(qr.code, qr.tableNumber)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    İndir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">QR Kod Kullanım Talimatları</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>✅ QR kodunuzu indirin ve masalarınıza bastırın</p>
          <p>✅ Müşteriler QR kodu okutarak dijital menünüzü görür</p>
          <p>✅ Fiyat değişikliği yaptığınızda QR kod değişmez, menü otomatik güncellenir</p>
          <p>✅ Analytics sayfasından hangi QR kodun ne kadar tarandığını görebilirsiniz</p>
        </CardContent>
      </Card>
    </div>
  )
}
