"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Proprietaire } from "../type/Proprietaire"
import { useState } from "react"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"

export const columns: ColumnDef<Proprietaire>[] = [
  {
    accessorKey: "nomComplet",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom Complet" />,
    cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("nomComplet")}</div>,
  },
  {
    accessorKey: "cin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="CIN" />,
    cell: ({ row }) => <div className="text-muted-foreground font-mono">{row.getValue("cin")}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "province.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Province" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.province?.name || "N/A"}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const proprietaire = row.original
      const [open, setOpen] = useState(false)

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-foreground">Actions</DropdownMenuLabel>
            <Link href={proprietaire.id ? `/proprietaires/${proprietaire.id}` : `#`}>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent">
                <Eye className="mr-2 h-4 w-4 text-primary" />
                Détails Propriétaire
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
