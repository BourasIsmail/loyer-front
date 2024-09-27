"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import { useQueryClient } from "react-query";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Paiement } from "@/app/type/Paiement";

export const columns: ColumnDef<Paiement>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mois" />
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Année" />
    ),
  },
  {
    accessorKey: "etat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Etat" />
    ),
  },
  {
    accessorKey: "local.adresse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="local " />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const paiement = row.original;
      const queryClient = useQueryClient();

      const [open, setopen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-left">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={paiement.id ? `/locaux/facture/${paiement.id}` : `#`}>
                <DropdownMenuItem>Details Facture</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
