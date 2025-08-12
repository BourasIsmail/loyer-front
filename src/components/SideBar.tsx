"use client"

import { getCurrentUsers, logout } from "@/app/api"
import { AiOutlineDashboard } from "react-icons/ai"
import { FaPeopleRoof } from "react-icons/fa6"
import { IoReceiptSharp } from "react-icons/io5"
import { FaUserAlt } from "react-icons/fa"
import { useState } from "react"
import Image from "next/image"
import type { UserInfo } from "@/app/type/UserInfo"
import { useQuery } from "react-query"
import { toast } from "@/hooks/use-toast"
import { MdOutlineNotificationAdd } from "react-icons/md"
import { FaPercentage } from "react-icons/fa"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Settings, LogOut } from "lucide-react"

const SideBar = () => {
  const pathname = usePathname()
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)

  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>("utilisateur", getCurrentUsers, {
    onSuccess: (data) => {
      setUtilisateurSelectionne(data)
    },
    onError: (error) => {
      toast({
        description: "Erreur lors de la récupération des données utilisateur",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const menuItems = [
    { href: "/", icon: AiOutlineDashboard, label: "Dashboard" },
    { href: "/locaux", icon: Building2, label: "Locaux" },
    { href: "/locaux/ov", icon: IoReceiptSharp, label: "Ordre de virement" },
    { href: "/proprietaires", icon: FaPeopleRoof, label: "Proprietaires" },
    { href: "/settings", icon: Settings, label: "Settings" },
    ...(utilisateur?.roles === "SUPER_ADMIN_ROLES"
      ? [{ href: "/accounts", icon: FaUserAlt, label: "Gestions des Comptes" }]
      : []),
    { href: "/avenant", icon: MdOutlineNotificationAdd, label: "Avenants" },
    ...(utilisateur?.roles === "SUPER_ADMIN_ROLES"
      ? [{ href: "/paramTaux", icon: FaPercentage, label: "Parametrage du taux" }]
      : []),
  ]

  return (
    <div className="fixed flex flex-col top-0 left-0 w-64 bg-white dark:bg-gray-900 h-full border-r border-gray-200 dark:border-gray-700 shadow-lg z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-grey-600 to-blue-700">
        <Image src="/logo.png" alt="Logo" width={120} height={80} className="object-contain" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-200 dark:bg-blue-800/50"
                      : "group-hover:bg-gray-200 dark:group-hover:bg-gray-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="truncate">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />}
              </a>
            )
          })}
        </nav>
      </div>

      {/* User Section & Logout */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {utilisateur && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {utilisateur.name || "Utilisateur"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{utilisateur.roles}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-md group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default SideBar
