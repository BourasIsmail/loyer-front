"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "react-query"
import type { UserInfo } from "@/app/type/UserInfo"
import { api, getUser } from "@/app/api"
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
import { User, Mail, Lock, MapPin, Shield, ArrowLeft } from "lucide-react"

export default function AccountDetailsPage({
  params,
}: {
  params: {
    id: string
  }
}) {
  const router = useRouter()
  const [selectedValue, setSelectedValue] = useState<UserInfo>()
  const [open, setOpen] = useState(false)

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUser(Number(params.id)),
    enabled: !!params.id,
    onSuccess: (data) => {
      setSelectedValue(data)
    },
  })

  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  })

  const updateUserMutation = useMutation((data: UserInfo) => api.put(`/auth/updateUser/${data.id}`, data), {
    onSuccess: () => {
      toast({
        description: "Mis à jour des données a réussi",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Success",
      })
      router.push("/accounts")
    },
    onError: () => {
      toast({
        description: "Mis à jour des données a échoué",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedValue) {
      updateUserMutation.mutate(selectedValue)
    }
  }

  const isSuperAdmin = user?.roles === "SUPER_ADMIN_ROLES"

  if (isLoadingUser || isLoadingProvinces) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SideBar />
        <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <Skeleton className="h-6 w-48 bg-blue-500" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Skeleton className="h-10 w-48" />
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
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <div className="max-w-4xl mx-auto">
          <BreadCrumb />

          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Comptes</h1>
              <p className="text-gray-600 mt-1">Modifier les informations du compte utilisateur</p>
            </div>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Informations du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Adresse e-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedValue?.email || ""}
                      onChange={(e) =>
                        setSelectedValue((prev) => ({
                          ...prev!,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Adresse e-mail"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 text-blue-600" />
                      Nom
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={selectedValue?.name || ""}
                      onChange={(e) =>
                        setSelectedValue((prev) => ({
                          ...prev!,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Nom"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                      onChange={(e) =>
                        setSelectedValue((prev) => ({
                          ...prev!,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Nouveau mot de passe (optionnel)"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Province
                    </Label>
                    <Select
                      value={selectedValue?.province?.id.toString()}
                      onValueChange={(value) =>
                        setSelectedValue((prev) => ({
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
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="roles" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Type de compte
                    </Label>
                    <Select
                      value={selectedValue?.roles}
                      onValueChange={(value) =>
                        setSelectedValue((prev) => ({
                          ...prev!,
                          roles: value,
                        }))
                      }
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
                  </div>
                </div>

                <div className="flex justify-start pt-4 border-t border-gray-200">
                  <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                        disabled={updateUserMutation.isLoading}
                      >
                        {updateUserMutation.isLoading ? "Mise à jour..." : "Confirmer la demande"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action confirmera la mise à jour des informations du compte utilisateur.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Continuer</AlertDialogAction>
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
