"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getAvenants } from "@/app/api/avenant"
import { getALLRegions } from "@/app/api/region"
import type { Avenant } from "@/app/type/Avenant"
import type { Region } from "@/app/type/Region"
import type { ColumnDef } from "@tanstack/react-table"
import { Trash2, Edit, Filter, FileText } from "lucide-react"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { api, getCurrentUsers } from "../api"
import type { UserInfo } from "../type/UserInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "./data-table"

export default function AvenantPage() {
  const [avenants, setAvenants] = useState<Avenant[]>([])
  const [filteredAvenants, setFilteredAvenants] = useState<Avenant[]>([])
  const [etatFilter, setEtatFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
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
  const { data, isLoading, error } = useQuery("avenants", getAvenants)

  useEffect(() => {
    if (data) {
      setAvenants(data)
      setFilteredAvenants(data)
    }
  }, [data])

  useEffect(() => {
    let filtered = avenants
    if (etatFilter && etatFilter !== "all") {
      filtered = filtered.filter((avenant) => avenant.etat === etatFilter)
    }
    if (regionFilter && regionFilter !== "all") {
      filtered = filtered.filter((avenant) => avenant.local?.province?.region.name === regionFilter)
    }
    setFilteredAvenants(filtered)
  }, [avenants, etatFilter, regionFilter])

  const handleDelete = async (id: number) => {
    const updatedAvenant = avenants.find((avenant) => avenant.id === id)
    if (updatedAvenant) {
      deleteMutation.mutate(updatedAvenant)
    }
  }

  const deleteMutation = useMutation((data: Avenant) => api.delete(`/Avenant/${data.id}`), {
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Avenant supprimé avec succès",
      })
      // Refetch data
      window.location.reload()
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "La suppression de l'avenant a échoué",
        variant: "destructive",
      })
    },
  })

  const handleUpdate = async (id: number) => {
    const updatedAvenant = avenants.find((avenant) => avenant.id === id)
    if (updatedAvenant) {
      updateMutation.mutate(updatedAvenant)
    }
  }

  const updateMutation = useMutation((data: Avenant) => api.put(`/Avenant/${data.id}`, data), {
    onSuccess: () => {
      toast({
        description: "Mise à jour des données réussie",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      })
    },
    onError: () => {
      toast({
        description: "Mise à jour des données échouée",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const columns: ColumnDef<Avenant>[] = [
    {
      accessorKey: "local",
      header: "Adresse",
      cell: ({ row }) => row.original.local?.adresse || "N/A",
    },
    {
      accessorKey: "local",
      header: "Province",
      cell: ({ row }) => row.original.local?.province?.name || "N/A",
    },
    {
      accessorKey: "local",
      header: "Région",
      cell: ({ row }) => row.original.local?.province?.region?.name || "N/A",
    },
    {
      accessorKey: "montant",
      header: "Montant",
      cell: ({ row }) => `${row.original.montant || 0} DH`,
    },
    {
      accessorKey: "etat",
      header: "État",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.etat}
          onValueChange={(value) => {
            const updatedRow = { ...row.original, etat: value }
            setAvenants((prev) => prev.map((av) => (av.id === row.original.id ? updatedRow : av)))
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="En Attente">En Attente</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleUpdate(row.original.id!)} className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          {utilisateur?.roles === "SUPER_ADMIN_ROLES" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(row.original.id!)}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SideBar />
        <div className="lg:ml-64 p-4 sm:p-6">
          <BreadCrumb />
          <div className="mt-6 space-y-6">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-48" />
                </div>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SideBar />
        <div className="lg:ml-64 p-4 sm:p-6">
          <BreadCrumb />
          <Card className="mt-6">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-500">Une erreur s'est produite: {(error as Error).message}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SideBar />
      <div className="lg:ml-64 p-4 sm:p-6">
        <BreadCrumb />

        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Avenants</h1>
              <p className="text-gray-600">Gérez et suivez tous vos avenants de contrat</p>
            </div>
          </div>

          {/* Filters Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="etatFilter">Filtrer par État</Label>
                  <Select onValueChange={setEtatFilter} value={etatFilter}>
                    <SelectTrigger id="etatFilter">
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les états</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="En Attente">En Attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regionFilter">Filtrer par Région</Label>
                  <Select onValueChange={setRegionFilter} value={regionFilter} disabled={isLoadingRegions}>
                    <SelectTrigger id="regionFilter">
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {regions?.map((region: Region) => (
                        <SelectItem key={region.id} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Table Card */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Avenants ({filteredAvenants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={filteredAvenants} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
