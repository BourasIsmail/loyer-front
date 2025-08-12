"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { getUsers, api } from "@/app/api"
import type { UserInfo } from "../type/UserInfo"
import SideBar from "@/components/SideBar"
import { BreadCrumb } from "@/components/BreadCrumb"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search, Edit, Trash2, UserCheck } from "lucide-react"
import Link from "next/link"

export default function AccountsManagement() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [userToDelete, setUserToDelete] = useState<UserInfo | null>(null)

  const queryClient = useQueryClient()

  const { data: users, isLoading, error } = useQuery<UserInfo[]>("users", getUsers())

  const deleteUserMutation = useMutation((userId: number) => api.delete(`/auth/${userId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("users")
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'utilisateur",
        variant: "destructive",
      })
    },
  })

  const handleDelete = (user: UserInfo) => {
    setUserToDelete(user)
  }

  const confirmDelete = () => {
    if (userToDelete && userToDelete.id) {
      deleteUserMutation.mutate(userToDelete.id)
    }
    setUserToDelete(null)
  }

  const columns: ColumnDef<UserInfo>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-gray-600">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "province.name",
      header: "Province",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {row.original.province?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex gap-2">
            <Link href={`/accounts/${user.id}`}>
              <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                <Edit className="h-3 w-3" />
                Modifier
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(user)}>
                  <Trash2 className="h-3 w-3" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement le compte utilisateur et
                    supprimera ses données de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete}>Continuer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return (
      <>
        <SideBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="lg:ml-64">
            <div className="p-6">
              <BreadCrumb />
              <div className="mt-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-6 w-6" />
                      Gestion des Comptes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-64" />
                      </div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <SideBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="lg:ml-64">
            <div className="p-6">
              <BreadCrumb />
              <div className="mt-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="text-red-500 text-lg font-medium mb-2">Erreur de chargement</div>
                      <p className="text-gray-600">Une erreur s'est produite: {(error as Error).message}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="lg:ml-64">
          <div className="p-6">
            <BreadCrumb />

            <div className="mt-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-6 w-6" />
                    Gestion des Comptes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Link href="/addComptes">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter Un Compte
                      </Button>
                    </Link>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par email..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id} className="bg-gray-50">
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id} className="font-semibold text-gray-700">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className="hover:bg-blue-50/50 transition-colors"
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="py-4">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                              Aucun résultat trouvé.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <div className="text-sm text-gray-600">
                      Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
