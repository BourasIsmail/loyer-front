"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { getLocauxByCoordination } from "@/app/api/local"
import { getALLRegions } from "@/app/api/region"
import type { Region } from "@/app/type/Region"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Local } from "@/app/type/Local"
import { api } from "@/app/api"
import { columns } from "../columns"
import type { ComptePayement } from "@/app/type/ComptePayement"
import { getComptes } from "@/app/api/comptePayement"
import { Skeleton } from "@/components/ui/skeleton"
import { FaMapMarkerAlt, FaCalendarAlt, FaFileDownload, FaCreditCard, FaHashtag } from "react-icons/fa"
import { DataTable } from "@/components/ui/data-table"

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [tableData, setTableData] = useState<Local[]>([])
  const [selectedRows, setSelectedRows] = useState<Local[]>([])
  const [date, setDate] = useState<string>("")
  const [nOrdre, setNOrdre] = useState<string>("")
  const [nOP, setNOP] = useState<string>("")
  const [mode, setMode] = useState<string>("")
  const [dateCreation, setDateCreation] = useState<string>("")
  const [comptePaiement, setComptePaiement] = useState<ComptePayement | null>(null)

  const { data: regions, isLoading: isLoadingRegions } = useQuery("regions", getALLRegions)
  const { data: comptes, isLoading: isLoadingComptes } = useQuery("comptePaiement", getComptes)

  useEffect(() => {
    if (selectedRegion) {
      getLocauxByCoordination(selectedRegion.id).then((data) => {
        setTableData(Array.isArray(data) ? data : [])
      })
    }
  }, [selectedRegion])

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRegion) {
      toast({
        description: "Veuillez sélectionner une région.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!date) {
      toast({
        description: "Veuillez entrer une date.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!nOrdre) {
      toast({
        description: "Veuillez entrer un numéro d'ordre.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!comptePaiement) {
      toast({
        description: "Veuillez sélectionner un compte de paiement.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!nOP) {
      toast({
        description: "Veuillez entrer un numéro OP.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!mode) {
      toast({
        description: "Veuillez entrer le mode de paiement.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (!dateCreation) {
      toast({
        description: "Veuillez entrer une date de création.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    if (selectedRows.length === 0) {
      toast({
        description: "Veuillez sélectionner au moins un local.",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
      return
    }

    const payload = {
      locals: selectedRows.map((local) => ({
        id: local.id,
        proprietaires: local.proprietaires,
        adresse: local.adresse,
        brutMensuel: local.brutMensuel,
        contrat: local.contrat,
        province: local.province,
      })),
      date: `${date}T00:00:00`,
      nOrdre: nOrdre,
      nOP: nOP,
      dateCreation: `${formatDateForAPI(dateCreation)}`,
      comptePaiement: comptePaiement,
      mode: mode,
    }

    try {
      const response = await api.post("/Paiement/ov", payload, {
        responseType: "blob",
      })
      console.log(payload)
      const dateObj = new Date(payload.date)
      const mois = (dateObj.getMonth() + 1).toString().padStart(2, "0")
      const year = dateObj.getFullYear()
      const filename = payload.locals[0].province?.region.name + "_" + mois + "_" + year + ".pdf"

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        description: "Téléchargement réussi",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      })
    } catch (error) {
      console.error(error)
      toast({
        description: "Erreur lors du téléchargement",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    }
  }

  if (isLoadingRegions || isLoadingComptes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SideBar />
        <div className="p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ordre de Virement</h1>
            <p className="text-gray-600">Générez les ordres de virement pour les paiements des locaux</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaFileDownload className="h-5 w-5" />
                Informations de Virement
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                    Choisissez une Coordination
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedRegion = regions?.find((r) => r.id.toString() === value)
                      if (selectedRegion) {
                        setSelectedRegion(selectedRegion)
                      }
                    }}
                  >
                    <SelectTrigger id="region" className="h-11">
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions?.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nOrdre" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaHashtag className="h-4 w-4 text-blue-600" />
                    N° Ordre de virement
                  </Label>
                  <Input
                    id="nOrdre"
                    type="number"
                    value={nOrdre}
                    onChange={(e) => setNOrdre(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comptePaiement" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaCreditCard className="h-4 w-4 text-blue-600" />
                    Choisissez un compte
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const compte = comptes?.find((r) => r?.id?.toString() === value) || null
                      setComptePaiement(compte)
                    }}
                  >
                    <SelectTrigger id="comptePaiement" className="h-11">
                      <SelectValue placeholder="Choisissez un compte" />
                    </SelectTrigger>
                    <SelectContent>
                      {comptes?.map((c) => (
                        <SelectItem key={c.id} value={c?.id?.toString() || ""}>
                          {c.numCompte}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nOP" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaHashtag className="h-4 w-4 text-blue-600" />
                    N° OP
                  </Label>
                  <Input
                    id="nOP"
                    type="number"
                    value={nOP}
                    onChange={(e) => setNOP(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateCreation" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                    Date de création
                  </Label>
                  <Input
                    id="dateCreation"
                    type="date"
                    value={dateCreation}
                    onChange={(e) => setDateCreation(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaCreditCard className="h-4 w-4 text-blue-600" />
                    Mode de paiement
                  </Label>
                  <Select onValueChange={(value) => setMode(value)} required>
                    <SelectTrigger id="mode" className="h-11">
                      <SelectValue placeholder="Choisissez un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mois">Mois</SelectItem>
                      <SelectItem value="trimestre">Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 h-11 flex items-center gap-2"
              >
                <FaFileDownload className="h-4 w-4" />
                Générer l'Ordre de Virement
              </Button>
            </form>
          </div>

          {/* Data Table */}
          {tableData.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Liste des Locaux</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {tableData.length} local{tableData.length > 1 ? "aux" : ""} trouvé{tableData.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="p-6">
                <DataTable columns={columns} data={tableData} onRowsSelected={setSelectedRows} />
              </div>
            </div>
          ) : selectedRegion ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaMapMarkerAlt className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun local trouvé</h3>
              <p className="text-gray-600">Aucun local ne correspond à la région sélectionnée.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaMapMarkerAlt className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sélectionnez une coordination</h3>
              <p className="text-gray-600">Choisissez une région pour afficher les locaux disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
