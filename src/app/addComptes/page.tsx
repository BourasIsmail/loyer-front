"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "react-query"
import type { UserInfo } from "@/app/type/UserInfo"
import { api } from "@/app/api"
import { getAllProvinces } from "@/app/api/province"
import SideBar from "@/components/SideBar"
import { BreadCrumb } from "@/components/BreadCrumb"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Mail, User, Lock, MapPin, Shield, ArrowLeft, UserPlus } from "lucide-react"

export default function AjouterCompte() {
  const router = useRouter()
  const [nouveauCompte, setNouveauCompte] = useState<Partial<UserInfo>>({})
  const [dialogueOuvert, setDialogueOuvert] = useState(false)

  // Fetch provinces
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery("provinces", getAllProvinces)

  const ajouterUtilisateur = useMutation((donnees: Partial<UserInfo>) => api.post("/auth/addUser", donnees), {
    onSuccess: () => {
      toast({
        description: "Le compte a été créé avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      })
      router.push("/accounts")
    },
    onError: () => {
      toast({
        description: "Erreur lors de la création du compte",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault()
    if (nouveauCompte) {
      ajouterUtilisateur.mutate(nouveauCompte)
    }
  }

  if (isLoadingProvinces) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SideBar />
        <div className="lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            <BreadCrumb />
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <Skeleton className="h-6 w-48 bg-blue-500" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SideBar />
      <div className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <BreadCrumb />

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Ajouter un Compte</h1>
            </div>
            <p className="text-gray-600">Créez un nouveau compte utilisateur pour votre système de gestion</p>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Informations du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
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
                      value={nouveauCompte.email || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="exemple@domaine.com"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                      value={nouveauCompte.name || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Nom et prénom"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Lock className="h-4 w-4 text-blue-600" />
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={nouveauCompte.password || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Mot de passe sécurisé"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Province
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          province: provinces?.find((p) => p.id === Number(value)),
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Type de compte
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          roles: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <AlertDialog open={dialogueOuvert} onOpenChange={setDialogueOuvert}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-2 h-11 shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={ajouterUtilisateur.isLoading}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {ajouterUtilisateur.isLoading ? "Création..." : "Créer le compte"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-green-600" />
                          Confirmer la création
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir créer ce compte utilisateur ? Cette action créera un nouveau compte
                          avec les informations saisies.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={gererSoumission} className="bg-green-600 hover:bg-green-700">
                          Créer le compte
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
  )
}
