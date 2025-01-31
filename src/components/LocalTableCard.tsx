import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Local } from "@/app/type/Local"
import { useQuery, useMutation } from "react-query"
import { toast } from "@/hooks/use-toast"

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
        <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button onClick={handleDownload} disabled={downloadMutation.isLoading}>
                    {downloadMutation.isLoading ? "Téléchargement..." : "Télécharger Excel"}
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Adresse</TableHead>
                            <TableHead>Propriétaire</TableHead>
                            <TableHead>RIB</TableHead>
                            <TableHead>Montant brut</TableHead>
                            <TableHead>mode de paiement</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5}>Chargement...</TableCell>
                            </TableRow>
                        ) : locaux && locaux.length > 0 ? (
                            locaux.slice(0, 10).map((local) => (
                                <TableRow key={local.id}>
                                    <TableCell className="max-w-xs truncate">{local.adresse}</TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {local.proprietaires?.map((p) => p.nomComplet).join(" et ")}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{local.rib}</TableCell>
                                    <TableCell>{local.brutMensuel} DH</TableCell>
                                    <TableCell>{local.modeDePaiement}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>Aucun local trouvé</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {locaux && locaux.length > 10 && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Affichage de 10 sur {locaux.length} locaux</div>
            )}
        </div>
    )
}

