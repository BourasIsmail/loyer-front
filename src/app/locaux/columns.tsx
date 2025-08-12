"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Local } from "../type/Local"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"

export const columns: ColumnDef<Local>[] = [
  {
    accessorKey: "adresse",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse" />,
    cell: ({ row }) => {
      const adresse = row.getValue("adresse") as string
      return <div className="font-medium">{adresse}</div>
    },
  },
  {
    accessorKey: "brutMensuel",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Montant Brut Mensuel" />,
    cell: ({ row }) => {
      const montant = row.getValue("brutMensuel") as number
      return <div className="font-medium text-green-600">{montant?.toLocaleString()} DH</div>
    },
  },
  {
    accessorKey: "proprietaires",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Propriétaires" />,
    cell: ({ row }) => {
      const proprietaires = row.original.proprietaires
      return (
        <div className="max-w-[200px] truncate">{(proprietaires ?? []).map((p: any) => p.nomComplet).join(", ")}</div>
      )
    },
  },
  {
    accessorKey: "province.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Province" />,
    cell: ({ row }) => {
      const province = row.original.province?.name
      return <div className="text-gray-600">{province}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const local = row.original

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-left" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={local.id ? `/locaux/${local.id}` : `#`}>
                <DropdownMenuItem className="cursor-pointer">Détails du local</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
