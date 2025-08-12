"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Proprietaire } from "@/app/type/Proprietaire"
import { getAllProvinces } from "@/app/api/province"
import { toast } from "@/hooks/use-toast"
import { api } from "@/app/api"
import { useRouter } from "next/navigation"
import { User, Phone, MapPin, Building, CreditCard, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function AddProprietaireFormComponent() {
  const [proprietaire, setProprietaire] = useState<Proprietaire>({
    nomComplet: "",
    cin: "",
    telephone: "",
    adresse: "",
    type: "",
    rib: [],
    province: undefined,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  })

  const handleChange = (field: keyof Proprietaire, value: any) => {
    setProprietaire((prev) => ({ ...prev, [field]: value }))
  }

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log(proprietaire)
      const response = await api.post(`/Proprietaire/add`, proprietaire)
      console.log(response)
      toast({
        description: "Propriétaire ajouté avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      })
      router.push("/proprietaire")
    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de l'ajout"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null && "toString" in error) {
        errorMessage = error.toString()
      }
      toast({
        description: "Erreur lors de l'ajout du propriétaire",
        variant: "destructive",
        duration: 5000,
        title: "Erreur",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingProvinces) {
    return (
      <div className="w-full space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nomComplet" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="h-4 w-4 text-blue-600" />
            <span>Nom Complet</span>
          </Label>
          <Input
            id="nomComplet"
            placeholder="Entrez le nom complet"
            value={proprietaire.nomComplet || ""}
            onChange={(e) => handleChange("nomComplet", e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cin" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span>CIN / IEF</span>
          </Label>
          <Input
            id="cin"
            placeholder="Entrez le CIN ou IEF"
            value={proprietaire.cin || ""}
            onChange={(e) => handleChange("cin", e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>Téléphone</span>
          </Label>
          <Input
            id="telephone"
            placeholder="Entrez le numéro de téléphone"
            value={proprietaire.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Adresse</span>
          </Label>
          <Input
            id="adresse"
            placeholder="Entrez l'adresse"
            value={proprietaire.adresse || ""}
            onChange={(e) => handleChange("adresse", e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Building className="h-4 w-4 text-blue-600" />
            <span>Type</span>
          </Label>
          <Select value={proprietaire.type} onValueChange={(value) => handleChange("type", value)} required>
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personne physique">Personne Physique</SelectItem>
              <SelectItem value="personne morale">Personne Morale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Province</span>
          </Label>
          <Select
            value={proprietaire.province?.id?.toString()}
            onValueChange={(value) => {
              const selectedProvince = provinces?.find((p) => p.id === Number(value))
              handleChange("province", selectedProvince)
            }}
            required
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Ajouter le Propriétaire
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/proprietaire")}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
