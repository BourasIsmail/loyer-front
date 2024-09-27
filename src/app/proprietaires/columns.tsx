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

export const columns: ColumnDef<Proprietaire>[] = [
  {
    accessorKey: "cin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CIN" />
    ),
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prenom" />
    ),
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
      const proprietaire = row.original;
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
              <Link
                href={
                  proprietaire.id ? `/proprietaires/${proprietaire.id}` : `#`
                }
              >
                <DropdownMenuItem>Details Proprietaire</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
