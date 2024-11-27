"use client";

import { useState, useEffect } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getAvenants, getAv } from "@/app/api/avenant";
import { getALLRegions } from "@/app/api/region";
import { Avenant } from "@/app/type/Avenant";
import { Region } from "@/app/type/Region";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Edit } from "lucide-react";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "./data-table";
import { api, getCurrentUsers } from "../api";
import { useRouter } from "next/router";
import { UserInfo } from "../type/UserInfo";

export default function AvenantTable() {
  const [avenants, setAvenants] = useState<Avenant[]>([]);
  const [filteredAvenants, setFilteredAvenants] = useState<Avenant[]>([]);
  const [etatFilter, setEtatFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UserInfo | null>(null);
  // Fetch current user
  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>(
    "utilisateur",
    getCurrentUsers,
    {
      onSuccess: (data) => {
        // Initialize form with user data when loaded
        setUtilisateurSelectionne(data);
      },
      onError: (error) => {
        toast({
          description: "Erreur lors de la récupération des données utilisateur",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        });
      },
    }
  );

  const { data: regions } = useQuery("regions", getALLRegions);
  const { data, isLoading, error } = useQuery("avenants", getAvenants);

  useEffect(() => {
    if (data) {
      console.log("Initial avenants data:", data);
      setAvenants(data);
      setFilteredAvenants(data);
    }
  }, [data]);

  useEffect(() => {
    let filtered = avenants;
    console.log(
      "Filtering with etat:",
      etatFilter,
      "and region:",
      regionFilter
    );
    if (etatFilter && etatFilter !== "all") {
      filtered = filtered.filter((avenant) => {
        console.log("Avenant etat:", avenant.etat, "Filter:", etatFilter);
        return avenant.etat === etatFilter;
      });
    }
    if (regionFilter && regionFilter !== "all") {
      filtered = filtered.filter((avenant) => {
        console.log(
          "Avenant region:",
          avenant.local?.province?.region.name,
          "Filter:",
          regionFilter
        );
        return avenant.local?.province?.region.name === regionFilter;
      });
    }
    console.log("Filtered avenants:", filtered);
    setFilteredAvenants(filtered);
  }, [avenants, etatFilter, regionFilter]);

  const handleDelete = async (id: number) => {
    const updatedAvenant = avenants.find((avenant) => avenant.id === id);
    if (updatedAvenant) {
      deleteMutation.mutate(updatedAvenant);
    }
  };

  const deleteMutation = useMutation(
    (data: Avenant) => api.delete(`/Avenant/${data.id}`),
    {
      onSuccess: () => {
        const queryClient = new QueryClient();
        queryClient.invalidateQueries("avenants");
        toast({
          title: "Success",
          description: "Avenant supprimé avec succès",
        });
        const router = useRouter();
        router.push("/avenants");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Avenant suppression a échoué",
          variant: "destructive",
        });
      },
    }
  );

  const handleUpdate = async (id: number) => {
    const updatedAvenant = avenants.find((avenant) => avenant.id === id);
    if (updatedAvenant) {
      updateMutation.mutate(updatedAvenant);
    }
  };

  const updateMutation = useMutation(
    (data: Avenant) => api.put(`/Avenant/${data.id}`, data),
    {
      onSuccess: () => {
        toast({
          description: "Mis à jour des données a réussi",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Success",
        });
      },
      onError: () => {
        toast({
          description: "Mis à jour des données a échoué",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        });
      },
    }
  );

  const columns: ColumnDef<Avenant>[] = [
    {
      accessorKey: "local",
      header: "Adresse",
      cell: ({ row }) => row.original.local?.adresse || "N/A",
    },
    {
      accessorKey: "local",
      header: "Province",
      cell: ({ row }) => row.original.local?.province?.name || "N/A",
    },
    {
      accessorKey: "local",
      header: "Region",
      cell: ({ row }) => row.original.local?.province?.region?.name || "N/A",
    },
    {
      accessorKey: "montant",
      header: "Montant",
    },
    {
      accessorKey: "etat",
      header: "Etat",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.etat}
          onValueChange={(value) => {
            const updatedRow = { ...row.original, etat: value };
            // Update the avenant in the avenants state
            setAvenants((prev) =>
              prev.map((av) => (av.id === row.original.id ? updatedRow : av))
            );
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="En Attente">En Attente</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdate(row.original.id!)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {utilisateur?.roles === "SUPER_ADMIN_ROLES" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(row.original.id!)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-5">Gestions des Avenants</h1>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <Label htmlFor="etatFilter">Filtre Par Etat</Label>
              <Select onValueChange={setEtatFilter} value={etatFilter}>
                <SelectTrigger id="etatFilter">
                  <SelectValue placeholder="Select Etat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="En Attente">En Attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label htmlFor="regionFilter">Filter by Region</Label>
              <Select onValueChange={setRegionFilter} value={regionFilter}>
                <SelectTrigger id="regionFilter">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {regions?.map((region: Region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataTable columns={columns} data={filteredAvenants} />
        </div>
      </div>
    </>
  );
}
