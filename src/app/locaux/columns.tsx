"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Proprietaire } from "../type/Proprietaire";
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
import { Local } from "../type/Local";

export const columns: ColumnDef<Local>[] = [
  {
    accessorKey: "adresse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse" />
    ),
  },
  {
    accessorKey: "brutMensuel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Montant Brut Mensuel" />
    ),
  },
  {
    accessorKey: "proprietaires",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proprietaires" />
    ),
    cell: ({ row }) => {
      const proprietaires = row.original.proprietaires;
      return (proprietaires ?? []).map((p: any) => p.nom).join(", ");
    },
  },
  {
    accessorKey: "province.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province " />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const local = row.original;
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
              <Link href={local.id ? `/locaux/${local.id}` : `#`}>
                <DropdownMenuItem>Details local</DropdownMenuItem>
              </Link>
              <Link
                href={local.id ? `/locaux/facture/?local=${local.id}` : `#`}
              >
                <DropdownMenuItem>facture</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
