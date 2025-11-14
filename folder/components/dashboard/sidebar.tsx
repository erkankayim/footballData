"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Package,
  QrCode,
  LineChart,
  Lightbulb,
  Users,
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Menü Yönetimi",
    icon: UtensilsCrossed,
    href: "/dashboard/menu",
  },
  {
    title: "Kategoriler",
    icon: FolderTree,
    href: "/dashboard/categories",
  },
  {
    title: "Malzemeler",
    icon: Package,
    href: "/dashboard/ingredients",
  },
  {
    title: "QR Kodlar",
    icon: QrCode,
    href: "/dashboard/qr-codes",
  },
  {
    title: "Rakip Analizi",
    icon: LineChart,
    href: "/dashboard/competitors",
  },
  {
    title: "AI Önerileri",
    icon: Lightbulb,
    href: "/dashboard/suggestions",
  },
  {
    title: "Ayarlar",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">MenuMaster AI</h1>
        <p className="text-xs text-gray-500 mt-1">Restoran Yönetimi</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
