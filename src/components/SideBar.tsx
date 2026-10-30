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
    <aside className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Image src="/logo.png" alt="Logo" width={120} height={80} className="object-contain" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Menu</p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                <span className="truncate">{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>

      {/* User & logout */}
      <div className="border-t border-border p-3">
        {utilisateur && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {(utilisateur.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{utilisateur.name || "Utilisateur"}</p>
              <p className="truncate text-xs text-muted-foreground">{utilisateur.roles}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

export default SideBar
