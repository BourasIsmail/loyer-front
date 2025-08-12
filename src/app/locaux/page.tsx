"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { columns } from "./columns"
import Link from "next/link"
import { getLocauxByCoordination } from "@/app/api/local"
import { getALLRegions } from "@/app/api/region"
import type { Region } from "@/app/type/Region"
import type { Local } from "../type/Local"
import { api, getCurrentUsers } from "../api"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaCheck, FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaFileDownload, FaCheckCircle, FaPlus } from "react-icons/fa"
import type { UserInfo } from "@/app/type/UserInfo"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/ui/data-table"

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [tableData, setTableData] = useState<Local[]>([])
  const [selectedRows, setSelectedRows] = useState<Local[]>([])
  const [date, setDate] = useState<string>("")
  const [confirmedLocals, setConfirmedLocals] = useState<number[]>([])
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)

  // Fetch current user
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

  const { data: regions, isLoading: isLoadingRegions } = useQuery("regions", getALLRegions)

  useEffect(() => {
    if (selectedRegion && date) {
      getLocauxByCoordination(selectedRegion.id).then((data) => {
        setTableData(Array.isArray(data) ? data : [])
        fetchConfirmedLocals()
      })
    }
  }, [selectedRegion, date])

  const fetchConfirmedLocals = async () => {
    if (selectedRegion && date) {
      try {
        const response = await api.get("/local/confirmed", {
          params: {
            date: date,
            regionName: selectedRegion.name,
          },
        })
        setConfirmedLocals(response.data.map((local: Local) => local.id))
      } catch (error) {
        console.error("Error fetching confirmed locals:", error)
        toast({
          description: "Erreur lors de la récupération des locaux confirmés",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRegion || !date) {
      toast({
        description: "Veuillez sélectionner une région et une date.",
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
    }

    try {
      const response = await api.post("/Paiement/paiements", payload, {
        responseType: "blob",
      })
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

  const handleConfirmedPayment = async () => {
    if (!selectedRegion || !date) {
      toast({
        description: "Veuillez sélectionner une région et une date.",
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

    const confirmedPayments = selectedRows.map((local) => ({
      local: {
        id: local.id,
      },
      date: date,
    }))

    try {
      const response = await api.post("/Confirme", confirmedPayments)
      toast({
        description: "Paiements confirmés avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      })
      fetchConfirmedLocals()
    } catch (error) {
      console.error(error)
      toast({
        description: "Erreur lors de la confirmation des paiements",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    }
  }

  const handleDeleteConfirmedPayment = async (localId: number, month: number, year: number) => {
    try {
      await api.delete(`/Confirme/local/${localId}/month/${month}/year/${year}`)
      toast({
        description: "Paiement confirmé supprimé avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      })
      fetchConfirmedLocals()
    } catch (error) {
      console.error(error)
      toast({
        description: "Erreur lors de la suppression du paiement confirmé",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    }
  }

  const dateObj = new Date(date)
  const mois = dateObj.getMonth() + 1
  const year = dateObj.getFullYear()

  const updatedColumns = [
    ...columns,
    {
      id: "confirmed",
      header: () => <div className="text-center font-medium">Confirmé</div>,
      cell: ({ row }: { row: { original: Local } }) =>
        row.original.id !== undefined && confirmedLocals.includes(row.original.id) ? (
          <div className="text-center">
            <FaCheck className="inline-block text-green-500 h-4 w-4" />
          </div>
        ) : null,
    },
    {
      id: "actions",
      header: () => <div className="text-center font-medium">Annuler Confirmation</div>,
      cell: ({ row }: { row: { original: Local } }) =>
        row.original.id !== undefined && confirmedLocals.includes(row.original.id) ? (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConfirmedPayment(row.original.id!, mois, year)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <FaTrash className="text-red-500 h-4 w-4" />
            </Button>
          </div>
        ) : null,
    },
  ]

  if (isLoadingUser || isLoadingRegions) {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex space-x-4 mb-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Locaux</h1>
            <p className="text-gray-600">Gérez vos propriétés et générez les documents de paiement</p>
          </div>

          {/* Filter Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaMapMarkerAlt className="h-5 w-5" />
                Filtres et Actions
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                    Choisissez une Coordination
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedId = Number(value)
                      const selectedRegionData = regions?.find((r) => r.id === selectedId)
                      if (selectedRegionData) {
                        setSelectedRegion(selectedRegionData)
                      }
                    }}
                  >
                    <SelectTrigger id="region" className="h-11">
                      <SelectValue placeholder={selectedRegion ? selectedRegion.name : "Sélectionner une région"} />
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
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 h-11 flex items-center gap-2"
                >
                  <FaFileDownload className="h-4 w-4" />
                  Générer PDF
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmedPayment}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 h-11 flex items-center gap-2"
                >
                  <FaCheckCircle className="h-4 w-4" />
                  Confirmer les paiements
                </Button>
              </div>
            </form>
          </div>

          {/* Add Local Button */}
          {utilisateur?.roles === "SUPER_ADMIN_ROLES" && (
            <div className="flex justify-end mb-6">
              <Link href="/locaux/ajouter">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 h-11 flex items-center gap-2">
                  <FaPlus className="h-4 w-4" />
                  Ajouter un local
                </Button>
              </Link>
            </div>
          )}

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
                <DataTable columns={updatedColumns} data={tableData} onRowsSelected={setSelectedRows} />
              </div>
            </div>
          ) : selectedRegion && date ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaMapMarkerAlt className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun local trouvé</h3>
              <p className="text-gray-600">Aucun local ne correspond aux critères sélectionnés.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaMapMarkerAlt className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sélectionnez vos critères</h3>
              <p className="text-gray-600">Choisissez une région et une date pour afficher les locaux.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
