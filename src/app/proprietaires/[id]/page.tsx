"use client"
import { api, getCurrentUsers } from "@/app/api"
import type React from "react"

import { getProprietaire } from "@/app/api/proprietaire"
import { getAllProvinces } from "@/app/api/province"
import type { Proprietaire } from "@/app/type/Proprietaire"
import type { UserInfo } from "@/app/type/UserInfo"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Building2, BadgeIcon as IdCard, MapPin, Phone, Save, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useQuery } from "react-query"

export default function ProprietaireDetails({
  params,
}: {
  params: {
    id: number
  }
}) {
  const [selectedValue, setselectedValue] = useState<Proprietaire>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: proprietaire, isLoading } = useQuery({
    queryKey: ["proprietaire", params.id],
    queryFn: () => getProprietaire(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setselectedValue(data)
    },
  })

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  })

  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>("utilisateur", getCurrentUsers, {
    onError: (error) => {
      toast({
        description: "Erreur lors de la récupération des données utilisateur",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedValue) return

    setIsSubmitting(true)
    try {
      const response = await api.put(`/Proprietaire/update/${params.id}`, selectedValue)
      toast({
        title: "Succès",
        description: "Les informations ont été modifiées avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification des informations",
        className: "bg-red-500 text-white",
        duration: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const is_Super_Admin = utilisateur?.roles === "SUPER_ADMIN_ROLES"

  if (isLoading || isLoadingUser) {
    return (
      <div className="min-h-screen bg-background">
        <SideBar />
        <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
          <BreadCrumb />
          <div className="mt-6">
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-primary text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 bg-card/20" />
                  <Skeleton className="h-6 w-48 bg-card/20" />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
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
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <BreadCrumb />

        <div className="mt-6">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <User className="h-6 w-6" />
                  Détails du Propriétaire
                </CardTitle>
                <Link href="/proprietaires">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-card/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4 text-primary" />
                      Nom Complet
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={selectedValue?.nomComplet || ""}
                      placeholder="Nom complet"
                      onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          nomComplet: e.target.value || "",
                        })
                      }
                      disabled={!is_Super_Admin}
                      className="h-11 border-border focus:border-ring focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Building2 className="h-4 w-4 text-primary" />
                      Type de Propriétaire
                    </Label>
                    <Select
                      value={selectedValue?.type || ""}
                      onValueChange={(value) =>
                        setselectedValue({
                          ...selectedValue,
                          type: value,
                        })
                      }
                      disabled={!is_Super_Admin}
                    >
                      <SelectTrigger className="h-11 border-border focus:border-ring focus:ring-ring">
                        <SelectValue placeholder="Choisissez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personne physique">Personne Physique</SelectItem>
                        <SelectItem value="personne morale">Personne Morale</SelectItem>
                        <SelectItem value="entreprise">Entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Province
                    </Label>
                    <Select
                      value={selectedValue?.province?.id?.toString() || ""}
                      onValueChange={(value) =>
                        setselectedValue({
                          ...selectedValue,
                          province: provinces?.find((item) => item.id === Number(value)) || undefined,
                        })
                      }
                      disabled={!is_Super_Admin}
                    >
                      <SelectTrigger className="h-11 border-border focus:border-ring focus:ring-ring">
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

                  <div className="space-y-2">
                    <Label htmlFor="cin" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <IdCard className="h-4 w-4 text-primary" />
                      CIN / IEF
                    </Label>
                    <Input
                      id="cin"
                      type="text"
                      value={selectedValue?.cin || ""}
                      placeholder="CIN ou IEF"
                      onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          cin: e.target.value || "",
                        })
                      }
                      disabled={!is_Super_Admin}
                      className="h-11 border-border focus:border-ring focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      Téléphone
                    </Label>
                    <Input
                      id="telephone"
                      type="text"
                      value={selectedValue?.telephone || ""}
                      placeholder="Numéro de téléphone"
                      onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          telephone: e.target.value || "",
                        })
                      }
                      disabled={!is_Super_Admin}
                      className="h-11 border-border focus:border-ring focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Adresse
                    </Label>
                    <Input
                      id="adresse"
                      type="text"
                      value={selectedValue?.adresse || ""}
                      placeholder="Adresse complète"
                      onChange={(e) =>
                        setselectedValue({
                          ...selectedValue,
                          adresse: e.target.value || "",
                        })
                      }
                      disabled={!is_Super_Admin}
                      className="h-11 border-border focus:border-ring focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex justify-start pt-4">
                  <Button
                    type="submit"
                    disabled={!is_Super_Admin || isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 h-11 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Modification en cours..." : "Modifier les informations"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
