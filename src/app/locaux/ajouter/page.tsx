"use client"

import type React from "react"

import { getProprietaires } from "@/app/api/proprietaire"
import { getAllProvinces } from "@/app/api/province"
import type { Local } from "@/app/type/Local"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import ReactSelect from "react-select"
import { useState } from "react"
import { useQuery } from "react-query"
import { api, getCurrentUsers } from "@/app/api"
import { toast } from "@/hooks/use-toast"
import type { UserInfo } from "@/app/type/UserInfo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Building2, MapPin, CreditCard, Calendar, Users, Banknote, FileText, Home } from "lucide-react"
import Link from "next/link"

export default function AjouterLocal() {
  const [selectedValue, setSelectedValue] = useState<Local>()
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const { data: proprietaires, isLoading: isLoadingProprietaires } = useQuery({
    queryKey: ["allProprietaires"],
    queryFn: getProprietaires,
  })

  const options5 = (Array.isArray(proprietaires) ? proprietaires : []).map((prop) => ({
    value: prop.id,
    label: prop.nomComplet,
  }))

  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedValue?.rib?.replace(/\s+/g, "").length !== 24) {
        toast({
          title: "Erreur",
          description: "Le RIB doit contenir 24 caractères",
          variant: "destructive",
          duration: 3000,
        })
        return
      }
      await api.post(`/local/add`, {
        ...selectedValue,
      })
      toast({
        title: "Succès",
        description: "Le local a été ajouté avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
      })
      router.push("/locaux")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du local",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const is_User = utilisateur?.roles === "USER_ROLES"
  const is_Observateur = utilisateur?.roles === "OBSERVATEUR_ROLES"

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <SideBar />
        <div className="p-4 sm:ml-64">
          <BreadCrumb />
          <div className="mt-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 bg-white/20" />
                  <Skeleton className="h-8 w-48 bg-white/20" />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SideBar />
      <div className="p-4 sm:ml-64">
        <BreadCrumb />

        <div className="mt-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  <CardTitle className="text-xl font-semibold">Ajouter un nouveau local</CardTitle>
                </div>
                <Link href="/locaux">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Adresse */}
                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Adresse
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="adresse"
                        value={selectedValue?.adresse || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            adresse: e.target.value,
                          } as Local)
                        }
                        placeholder="Entrez l'adresse du local"
                        disabled={is_Observateur}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  {/* Montant brut */}
                  <div className="space-y-2">
                    <Label htmlFor="brutMensuel" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Banknote className="h-4 w-4 text-green-600" />
                      Montant brut mensuel (DH)
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="brutMensuel"
                        type="number"
                        value={selectedValue?.brutMensuel || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            brutMensuel: Number(e.target.value),
                          } as Local)
                        }
                        placeholder="0.00"
                        disabled={is_Observateur}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  {/* RIB */}
                  <div className="space-y-2">
                    <Label htmlFor="rib" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      RIB (24 caractères)
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="rib"
                        value={selectedValue?.rib || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            rib: e.target.value,
                          } as Local)
                        }
                        placeholder="XXXX XXXX XXXX XXXX XXXX XX"
                        disabled={is_Observateur}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        maxLength={24}
                      />
                    )}
                  </div>

                  {/* État du local */}
                  <div className="space-y-2">
                    <Label htmlFor="etat" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Home className="h-4 w-4 text-orange-600" />
                      État du local
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={selectedValue?.etat}
                        disabled={is_Observateur}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            etat: value,
                          } as Local)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez l'état du local" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="résilié">Résilié</SelectItem>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="suspendu">Suspendu</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Date d'effet de contrat */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateEffetContrat"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Calendar className="h-4 w-4 text-red-600" />
                      Date d'effet de contrat
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        id="dateEffetContrat"
                        type="date"
                        disabled={is_Observateur}
                        value={selectedValue?.dateEffetContrat || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            dateEffetContrat: e.target.value,
                          } as Local)
                        }
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  {/* Province */}
                  <div className="space-y-2">
                    <Label htmlFor="province" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      Province
                    </Label>
                    {isLoadingProvinces ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={selectedValue?.province?.id.toString()}
                        disabled={is_Observateur}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            province: provinces?.find((p) => p.id === Number(value)),
                          } as Local)
                        }
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
                    )}
                  </div>

                  {/* Mode de paiement */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="modeDePaiement"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <FileText className="h-4 w-4 text-teal-600" />
                      Mode de paiement
                    </Label>
                    {isLoadingUser ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={selectedValue?.modeDePaiement}
                        disabled={is_Observateur}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            modeDePaiement: value,
                          } as Local)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez le mode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virement">Virement</SelectItem>
                          <SelectItem value="Chèque">Chèque</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Propriétaires - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="proprietaires" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4 text-blue-600" />
                    Propriétaires
                  </Label>
                  {isLoadingProprietaires ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <ReactSelect
                      options={options5}
                      value={selectedValue?.proprietaires?.map((prop) =>
                        options5.find((option) => option.value === prop.id),
                      )}
                      onChange={(selectedOption) => {
                        setSelectedValue({
                          ...selectedValue,
                          proprietaires: selectedOption.map((option: any) => ({
                            id: option.value,
                            nom: option.label,
                          })),
                        } as Local)
                      }}
                      placeholder="Sélectionnez les propriétaires"
                      isMulti
                      classNamePrefix="react-select"
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                          boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                          backgroundColor: "white",
                          minHeight: "40px",
                        }),
                        menu: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: "white",
                          zIndex: 50,
                        }),
                        option: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
                          color: state.isSelected ? "white" : "#374151",
                          "&:hover": {
                            backgroundColor: state.isSelected ? "#3b82f6" : "#eff6ff",
                          },
                        }),
                        multiValue: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: "#eff6ff",
                        }),
                        multiValueLabel: (baseStyles) => ({
                          ...baseStyles,
                          color: "#1f2937",
                        }),
                        multiValueRemove: (baseStyles) => ({
                          ...baseStyles,
                          color: "#6b7280",
                          "&:hover": {
                            backgroundColor: "#fca5a5",
                            color: "#dc2626",
                          },
                        }),
                      }}
                      isDisabled={is_Observateur}
                    />
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    disabled={is_Observateur || isLoadingUser}
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Ajouter le local
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
