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
import type { Local } from "@/app/type/Local"
import type { ColumnDef } from "@tanstack/react-table"
import { Trash2, Edit, Filter, FileText, Plus, Download } from "lucide-react"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { api, getCurrentUsers } from "../api"
import type { UserInfo } from "../type/UserInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "./data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AvenantPage() {
  const [avenants, setAvenants] = useState<Avenant[]>([])
  const [filteredAvenants, setFilteredAvenants] = useState<Avenant[]>([])
  const [etatFilter, setEtatFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRegionForAdd, setSelectedRegionForAdd] = useState<Region | null>(null)
  const [availableLocals, setAvailableLocals] = useState<Local[]>([])
  const [isLoadingLocals, setIsLoadingLocals] = useState(false)
  const [newAvenant, setNewAvenant] = useState({
    montant: "",
    description: "",
    localId: "",
    etat: "En Attente",
  })

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

  useEffect(() => {
    if (selectedRegionForAdd) {
      setIsLoadingLocals(true)
      api
          .get(`/local/region/${selectedRegionForAdd.id}`)
          .then((response) => {
            setAvailableLocals(Array.isArray(response.data) ? response.data : [])
          })
          .catch((error) => {
            console.error("Error fetching locals:", error)
            toast({
              description: "Erreur lors de la récupération des locaux",
              variant: "destructive",
              duration: 3000,
              title: "Erreur",
            })
            setAvailableLocals([])
          })
          .finally(() => {
            setIsLoadingLocals(false)
          })
    } else {
      setAvailableLocals([])
    }
  }, [selectedRegionForAdd])

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

  const addMutation = useMutation((data: any) => api.post("/Avenant", data), {
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Avenant ajouté avec succès",
      })
      setIsAddDialogOpen(false)
      setNewAvenant({
        montant: "",
        description: "",
        localId: "",
        etat: "En Attente",
      })
      setSelectedRegionForAdd(null)
      setAvailableLocals([])
      window.location.reload()
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "L'ajout de l'avenant a échoué",
        variant: "destructive",
      })
    },
  })

  const handleAddAvenant = () => {
    if (!newAvenant.montant || !newAvenant.localId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const avenantData = {
      montant: Number.parseFloat(newAvenant.montant),
      description: newAvenant.description,
      local: {
        id: Number.parseInt(newAvenant.localId),
      },
      etat: newAvenant.etat,
    }

    addMutation.mutate(avenantData)
  }

  const handleDownloadEtat = async (avenant: Avenant) => {
    try {
      const response = await api.post("/Avenant/downloadEtat", avenant, {
        responseType: "blob",
      })

      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `etat_avenant_${avenant.id}.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Succès",
        description: "L'état a été téléchargé avec succès",
      })
    } catch (error) {
      console.error("Error downloading etat:", error)
      toast({
        title: "Erreur",
        description: "Le téléchargement de l'état a échoué",
        variant: "destructive",
      })
    }
  }

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
            <Button
                variant="outline"
                size="icon"
                onClick={() => handleDownloadEtat(row.original)}
                className="h-8 w-8"
                title="Télécharger l'état"
            >
              <Download className="h-4 w-4" />
            </Button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Avenants</h1>
                  <p className="text-gray-600">Gérez et suivez tous vos avenants de contrat</p>
                </div>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter Avenant
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter un Nouvel Avenant</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="regionSelect">Région *</Label>
                      <Select
                          value={selectedRegionForAdd?.id.toString() || ""}
                          onValueChange={(value) => {
                            const selectedId = Number(value)
                            const selectedRegionData = regions?.find((r) => r.id === selectedId)
                            if (selectedRegionData) {
                              setSelectedRegionForAdd(selectedRegionData)
                              setNewAvenant((prev) => ({ ...prev, localId: "" }))
                            }
                          }}
                      >
                        <SelectTrigger id="regionSelect">
                          <SelectValue placeholder="Sélectionner une région" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions?.map((region: Region) => (
                              <SelectItem key={region.id} value={region.id.toString()}>
                                {region.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="localSelect">Local (Adresse) *</Label>
                      <Select
                          value={newAvenant.localId}
                          onValueChange={(value) => setNewAvenant((prev) => ({ ...prev, localId: value }))}
                          disabled={!selectedRegionForAdd || isLoadingLocals}
                      >
                        <SelectTrigger id="localSelect">
                          <SelectValue
                              placeholder={
                                !selectedRegionForAdd
                                    ? "Sélectionnez d'abord une région"
                                    : isLoadingLocals
                                        ? "Chargement..."
                                        : "Sélectionner un local"
                              }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLocals.length > 0 ? (
                              availableLocals.map((local: Local) => (
                                  <SelectItem key={local.id} value={local.id!.toString()}>
                                    {local.adresse} - {local.province?.name}
                                  </SelectItem>
                              ))
                          ) : (
                              <SelectItem value="no-locals" disabled>
                                Aucun local disponible
                              </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="montant">Montant (DH) *</Label>
                      <Input
                          id="montant"
                          type="number"
                          placeholder="Entrez le montant"
                          value={newAvenant.montant}
                          onChange={(e) => setNewAvenant((prev) => ({ ...prev, montant: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                          id="description"
                          placeholder="Description de l'avenant (optionnel)"
                          value={newAvenant.description}
                          onChange={(e) => setNewAvenant((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="etat">État</Label>
                      <Select
                          value={newAvenant.etat}
                          onValueChange={(value) => setNewAvenant((prev) => ({ ...prev, etat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En Attente">En Attente</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Terminé">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false)
                            setSelectedRegionForAdd(null)
                            setAvailableLocals([])
                          }}
                      >
                        Annuler
                      </Button>
                      <Button onClick={handleAddAvenant} disabled={addMutation.isLoading}>
                        {addMutation.isLoading ? "Ajout..." : "Ajouter"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

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
