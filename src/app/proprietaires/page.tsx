"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { columns } from "./columns"
import type { Proprietaire } from "../type/Proprietaire"
import type { Region } from "../type/Region"
import Link from "next/link"
import { useQuery, useMutation } from "react-query"
import { getProprietaires, generateConfirmedPaymentsReport, getProprietaireByRegion } from "../api/proprietaire"
import type { UserInfo } from "../type/UserInfo"
import { useState, useCallback, useEffect } from "react"
import { getCurrentUsers } from "../api"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users, FileText, Filter, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getALLRegions } from "@/app/api/region"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/ui/data-table"

export default function ProprietairePage() {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null)
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([])
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)
  const [selectedProprietaires, setSelectedProprietaires] = useState<Proprietaire[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: allProprietaires, isLoading: isLoadingProprietaires } = useQuery({
    queryKey: ["allProprietaires"],
    queryFn: getProprietaires,
  })

  const { data: proprietairesByRegion, isLoading: isLoadingByRegion } = useQuery({
    queryKey: ["proprietairesByRegion", selectedRegion],
    queryFn: () => getProprietaireByRegion(selectedRegion!),
    enabled: !!selectedRegion,
  })

  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ["allRegions"],
    queryFn: getALLRegions,
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

  useEffect(() => {
    if (selectedRegion && proprietairesByRegion) {
      setProprietaires(proprietairesByRegion)
    } else if (allProprietaires) {
      setProprietaires(allProprietaires)
    }
  }, [selectedRegion, proprietairesByRegion, allProprietaires])

  const generatePdfMutation = useMutation(
    ({ id, year }: { id: number; year: number }) => generateConfirmedPaymentsReport(id, year),
    {
      onSuccess: (data) => {
        const blob = new Blob([data], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `confirmed_payments_${selectedProprietaires[0]?.nomComplet}_${selectedYear}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        setIsDialogOpen(false)
        toast({
          description: "Rapport PDF généré avec succès",
          duration: 3000,
          title: "Succès",
        })
      },
      onError: (error) => {
        toast({
          description: "Erreur lors de la génération du rapport PDF",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        })
      },
    },
  )

  const is_Observateur = utilisateur?.roles === "OBSERVATEUR_ROLES"
  const is_Super_Admin = utilisateur?.roles === "SUPER_ADMIN_ROLES"

  const handleGeneratePdf = useCallback(() => {
    if (selectedProprietaires.length > 0 && selectedYear) {
      generatePdfMutation.mutate({
        id: selectedProprietaires[0].id || 0,
        year: selectedYear,
      })
    }
  }, [selectedProprietaires, selectedYear, generatePdfMutation])

  const handleRowsSelected = useCallback((rows: Proprietaire[]) => {
    setSelectedProprietaires(rows)
  }, [])

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <SideBar />
        <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <BreadCrumb />

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Liste des Propriétaires</h1>
                  <p className="text-blue-100 text-sm">{proprietaires?.length || 0} propriétaire(s) trouvé(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <Select
                  onValueChange={(value) => setSelectedRegion(value ? Number(value) : null)}
                  disabled={isLoadingRegions}
                >
                  <SelectTrigger className="w-[200px] bg-white border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Filtrer par région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Toutes les régions</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Link href={"proprietaires/ajouter"}>
                  <Button
                    disabled={!is_Super_Admin}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Propriétaire
                  </Button>
                </Link>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={selectedProprietaires.length === 0}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200 bg-transparent"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Générer Rapport PDF
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Générer un rapport PDF</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proprietaire" className="text-right font-medium">
                          Propriétaire
                        </Label>
                        <div className="col-span-3 p-2 bg-gray-50 rounded-md text-sm">
                          {selectedProprietaires.length > 0
                            ? selectedProprietaires[0].nomComplet
                            : "Aucun propriétaire sélectionné"}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right font-medium">
                          Année
                        </Label>
                        <Input
                          id="year"
                          type="number"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleGeneratePdf}
                      disabled={selectedProprietaires.length === 0 || !selectedYear || generatePdfMutation.isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {generatePdfMutation.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Générer PDF
                        </>
                      )}
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6">
            {isLoadingProprietaires || isLoadingByRegion ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <DataTable columns={columns} data={proprietaires || []} onRowsSelected={handleRowsSelected} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
