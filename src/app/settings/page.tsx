"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "react-query"
import type { UserInfo } from "@/app/type/UserInfo"
import { api } from "@/app/api"
import { getAllProvinces } from "@/app/api/province"
import { getCookie } from "cookies-next"
import SideBar from "@/components/SideBar"
import { BreadCrumb } from "@/components/BreadCrumb"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Mail, Lock, MapPin, Shield, Save, AlertCircle } from "lucide-react"

// Modified getCurrentUser to work directly with useQuery
async function getCurrentUser(): Promise<UserInfo> {
  const token = getCookie("token")
  if (!token) throw new Error("No token found")

  const payload = JSON.parse(atob(token.split(".")[1]))
  const email = payload.sub

  const { data } = await api.get("/auth/email/" + email)
  return data
}

export default function Settings() {
  const router = useRouter()
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)
  const [dialogueOuvert, setDialogueOuvert] = useState(false)

  // Fetch current user
  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>("utilisateur", getCurrentUser, {
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

  // Fetch provinces
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery("provinces", getAllProvinces)

  const miseAJourUtilisateur = useMutation((donnees: UserInfo) => api.put(`/auth/updateUser/${donnees.id}`, donnees), {
    onSuccess: () => {
      toast({
        description: "Les données ont été mises à jour avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      })
    },
    onError: () => {
      toast({
        description: "Erreur lors de la mise à jour des données",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault()
    if (utilisateurSelectionne) {
      miseAJourUtilisateur.mutate(utilisateurSelectionne)
    }
  }

  const isSuperAdmin = utilisateur?.roles === "SUPER_ADMIN_ROLES"

  if (isLoadingUser || isLoadingProvinces) {
    return (
      <>
        <SideBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            <BreadCrumb />
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Card className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-48" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 ml-64">
        <div className="max-w-4xl mx-auto space-y-6">
          <BreadCrumb />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Paramètres du Compte</h1>
                <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
              </div>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informations du Compte
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Modifiez vos informations personnelles et paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={gererSoumission} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Adresse e-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={utilisateurSelectionne?.email || ""}
                        onChange={(e) =>
                          setUtilisateurSelectionne((prev) => ({
                            ...prev!,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Adresse e-mail"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="h-4 w-4 text-blue-600" />
                        Nom complet
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={utilisateurSelectionne?.name || ""}
                        onChange={(e) =>
                          setUtilisateurSelectionne((prev) => ({
                            ...prev!,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nom complet"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Lock className="h-4 w-4 text-blue-600" />
                        Nouveau mot de passe
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        onChange={(e) =>
                          setUtilisateurSelectionne((prev) => ({
                            ...prev!,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Laissez vide pour conserver le mot de passe actuel"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Province
                      </Label>
                      <Select
                        value={utilisateurSelectionne?.province?.id.toString()}
                        onValueChange={(value) =>
                          setUtilisateurSelectionne((prev) => ({
                            ...prev!,
                            province: provinces?.find((p) => p.id === Number(value)),
                          }))
                        }
                        disabled={!isSuperAdmin}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez une province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces?.map((province) => (
                            <SelectItem key={province.id} value={province.id.toString()}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isSuperAdmin && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Seuls les super administrateurs peuvent modifier la province
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="roles" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Type de compte
                      </Label>
                      <Select
                        value={utilisateurSelectionne?.roles}
                        onValueChange={(value) =>
                          setUtilisateurSelectionne((prev) => ({
                            ...prev!,
                            roles: value,
                          }))
                        }
                        disabled={!isSuperAdmin}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez un type de compte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER_ROLES">Compte utilisateur de service de droit juridique</SelectItem>
                          <SelectItem value="ADMIN_ROLES">Compte utilisateur service budget</SelectItem>
                          <SelectItem value="SUPER_ADMIN_ROLES">Compte administrateur</SelectItem>
                          <SelectItem value="OBSERVATEUR_ROLES">
                            Compte utilisateur Division de la Gestion des Ressources Financières
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {!isSuperAdmin && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Seuls les super administrateurs peuvent modifier le type de compte
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-start pt-4 border-t border-gray-200">
                    <AlertDialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                          disabled={miseAJourUtilisateur.isLoading}
                        >
                          <Save className="h-4 w-4" />
                          {miseAJourUtilisateur.isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-0 shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-xl">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            Confirmer les modifications
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Êtes-vous sûr de vouloir enregistrer ces modifications ? Cette action mettra à jour vos
                            informations de compte.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={gererSoumission}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
