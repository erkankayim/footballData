import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, FolderTree, QrCode, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.restaurantId) {
    return <div>Unauthorized</div>
  }

  // İstatistikleri çek
  const [menuItemCount, categoryCount, qrCodeCount] = await Promise.all([
    prisma.menuItem.count({
      where: { restaurantId: session.user.restaurantId }
    }),
    prisma.category.count({
      where: { restaurantId: session.user.restaurantId }
    }),
    prisma.qRCode.count({
      where: { restaurantId: session.user.restaurantId }
    }),
  ])

  const stats = [
    {
      title: "Toplam Ürün",
      value: menuItemCount,
      icon: UtensilsCrossed,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Kategoriler",
      value: categoryCount,
      icon: FolderTree,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "QR Kodlar",
      value: qrCodeCount,
      icon: QrCode,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Toplam Görüntüleme",
      value: "0",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Restoran istatistikleriniz</p>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/menu"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Yeni Ürün Ekle</h3>
              <p className="text-sm text-gray-600">Menünüze yeni ürün ekleyin</p>
            </a>
            <a
              href="/dashboard/categories"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Kategori Oluştur</h3>
              <p className="text-sm text-gray-600">Yeni kategori tanımlayın</p>
            </a>
            <a
              href="/dashboard/qr-codes"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">QR Kod Oluştur</h3>
              <p className="text-sm text-gray-600">Yeni QR menü kodu oluşturun</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
