"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { DataTable } from "@/components/ui/data-table"
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
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {getALLRegions} from "@/app/api/region";

export default function Home() {
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
  const is_Super_Admin = utilisateur?.roles === "SUPER_ADMIN_ROLES";


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

  console.log("selectedProprietaires", selectedProprietaires)

  return (
      <>
        <SideBar />
        <div className="p-4 ml-64">
          <BreadCrumb />
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold py-2">Liste des Propriétaires</h1>
            <div className="flex items-center">
              <Select
                  onValueChange={(value) => setSelectedRegion(value ? Number(value) : null)}
                  disabled={isLoadingRegions}
              >
                <SelectTrigger className="w-[200px] mr-4">
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
              <Link href={"proprietaires/ajouter"}>
                <Button disabled={!is_Super_Admin} className="mr-2">
                  Ajouter Propriétaires
                </Button>
              </Link>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={selectedProprietaires.length === 0}>Générer Rapport PDF</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Générer un rapport PDF</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="proprietaire" className="text-right">
                        Propriétaire
                      </Label>
                      <div className="col-span-3">
                        {selectedProprietaires.length > 0
                            ? selectedProprietaires[0].nomComplet
                            : "Aucun propriétaire sélectionné"}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="year" className="text-right">
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
                  >
                    {generatePdfMutation.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                    ) : (
                        "Générer PDF"
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="p-2 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
            <DataTable columns={columns} data={proprietaires || []} onRowsSelected={handleRowsSelected} />
          </div>
        </div>
      </>
  )
}

