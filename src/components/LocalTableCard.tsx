"use client"

import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Local } from "@/app/type/Local"
import { useQuery, useMutation } from "react-query"
import { toast } from "@/hooks/use-toast"
import { Download, FileSpreadsheet, Building2 } from "lucide-react"

interface LocalTableCardProps {
  title: string
  queryKey: string
  queryFn: () => Promise<Local[]>
  downloadFn: () => Promise<Blob>
}

export function LocalTableCard({ title, queryKey, queryFn, downloadFn }: LocalTableCardProps) {
  const { data: locaux, isLoading } = useQuery<Local[]>(queryKey, queryFn)

  const downloadMutation = useMutation(downloadFn, {
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(" ", "_")}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast({
        title: "Téléchargement réussi",
        description: "Le fichier Excel a été téléchargé avec succès.",
        duration: 3000,
      })
    },
    onError: (error) => {
      console.error("Download error:", error)
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement du fichier Excel.",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  const handleDownload = () => {
    downloadMutation.mutate()
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
          </div>
          <Button
            onClick={handleDownload}
            disabled={downloadMutation.isLoading}
            className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-200"
            size="sm"
          >
            {downloadMutation.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Téléchargement...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Adresse</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Propriétaire</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">RIB</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Montant brut</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Mode de paiement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : locaux && locaux.length > 0 ? (
                locaux.slice(0, 10).map((local) => (
                  <TableRow key={local.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="max-w-xs truncate font-medium text-gray-900 dark:text-gray-100">
                      {local.adresse}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-700 dark:text-gray-300">
                      {local.proprietaires?.map((p) => p.nomComplet).join(" et ")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600 dark:text-gray-400 font-mono text-sm">
                      {local.rib}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {local.brutMensuel} DH
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                        {local.modeDePaiement}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Aucun local trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {locaux && locaux.length > 10 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
            <span>Affichage de 10 sur {locaux.length} locaux</span>
            <Badge variant="secondary">{locaux.length - 10} de plus</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
