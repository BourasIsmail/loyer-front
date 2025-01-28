"use client";

import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { getLocauxByCoordination } from "@/app/api/local";
import { getALLRegions } from "@/app/api/region";
import { Region } from "@/app/type/Region";
import { Local } from "../type/Local";
import axios from "axios";
import {api, getCurrentUsers} from "../api";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCheck, FaTrash } from "react-icons/fa";
import {UserInfo} from "@/app/type/UserInfo";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [tableData, setTableData] = useState<Local[]>([]);
  const [selectedRows, setSelectedRows] = useState<Local[]>([]);
  const [date, setDate] = useState<string>("");
  const [confirmedLocals, setConfirmedLocals] = useState<number[]>([]);
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

  useEffect(() => {
    if (selectedRegion && date) {
      getLocauxByCoordination(selectedRegion.id).then((data) => {
        setTableData(Array.isArray(data) ? data : []);
        fetchConfirmedLocals();
      });
    }
  }, [selectedRegion, date]);

  const fetchConfirmedLocals = async () => {
    if (selectedRegion && date) {
      try {
        const response = await api.get("/local/confirmed", {
          params: {
            date: date,
            regionName: selectedRegion.name,
          },
        });
        setConfirmedLocals(response.data.map((local: Local) => local.id));
      } catch (error) {
        console.error("Error fetching confirmed locals:", error);
        toast({
          description: "Error fetching confirmed locals",
          variant: "destructive",
          duration: 3000,
          title: "Error",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegion || !date) {
      toast({
        description: "Please select a region and a date.",
        variant: "destructive",
        duration: 3000,
        title: "Error",
      });
      return;
    }

    if (selectedRows.length === 0) {
      toast({
        description: "Please select at least one local.",
        variant: "destructive",
        duration: 3000,
        title: "Error",
      });
      return;
    }

    const payload = {
      locals: selectedRows.map((local) => ({
        id: local.id,
        proprietaires: local.proprietaires,
        adresse: local.adresse,
        brutMensuel: local.brutMensuel,
        contrat: local.contrat,
        province: local.province,
      })),
      date: `${date}T00:00:00`, // Formatting the date if needed
    };

    try {
      const response = await api.post("/Paiement/paiements", payload, {
        responseType: "blob", // Important for handling file downloads
      });
      const dateObj = new Date(payload.date);
      const mois = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear();
      const filename =
        payload.locals[0].province?.region.name +
        "_" +
        mois +
        "_" +
        year +
        ".pdf";

      // Create a URL for the file and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Toast success message
      toast({
        description: "Télechargement réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
    } catch (error) {
      console.error(error);
      // Toast error message
      toast({
        description: "Erreur lors du téléchargement",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  const handleConfirmedPayment = async () => {
    if (!selectedRegion || !date) {
      toast({
        description: "Please select a region and a date.",
        variant: "destructive",
        duration: 3000,
        title: "Error",
      });
      return;
    }

    if (selectedRows.length === 0) {
      toast({
        description: "Please select at least one local.",
        variant: "destructive",
        duration: 3000,
        title: "Error",
      });
      return;
    }

    const dateObj = new Date(date);
    const mois = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const confirmedPayments = selectedRows.map((local) => ({
      local: {
        id: local.id,
      },
      date: date,
    }));

    try {
      const response = await api.post("/Confirme", confirmedPayments);
      toast({
        description: "Paiements confirmés avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
      fetchConfirmedLocals(); // Refresh the confirmed locals after confirmation
    } catch (error) {
      console.error(error);
      toast({
        description: "Erreur lors de la confirmation des paiements",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  const handleDeleteConfirmedPayment = async (
    localId: number,
    month: number,
    year: number
  ) => {
    try {
      await api.delete(
        `/Confirme/local/${localId}/month/${month}/year/${year}`
      );
      toast({
        description: "Paiement confirmé supprimé avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
      fetchConfirmedLocals(); // Refresh the confirmed locals after deletion
    } catch (error) {
      console.error(error);
      toast({
        description: "Erreur lors de la suppression du paiement confirmé",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };
  const dateObj = new Date(date);
  const mois = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const updatedColumns = [
    ...columns,
    {
      id: "confirmed",
      header: () => <div className="text-center">Confirmé</div>,
      cell: ({ row }: { row: { original: Local } }) =>
        row.original.id !== undefined &&
        confirmedLocals.includes(row.original.id) ? (
          <div className="text-center">
            <FaCheck className="inline-block text-green-500" />
          </div>
        ) : null,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Annuler Confirmation</div>,
      cell: ({ row }: { row: { original: Local } }) =>
        row.original.id !== undefined &&
        confirmedLocals.includes(row.original.id) ? (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDeleteConfirmedPayment(row.original.id!, mois, year)
              }
            >
              <FaTrash className="text-red-500" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Choisissez une Coordination</Label>
              <Select
                onValueChange={(value) => {
                  const selectedId = Number(value);
                  const selectedRegionData = regions?.find(
                    (r) => r.id === selectedId
                  );
                  if (selectedRegionData) {
                    setSelectedRegion(selectedRegionData);
                  }
                }}
              >
                <SelectTrigger id="region">
                  <SelectValue
                    placeholder={
                      selectedRegion ? selectedRegion.name : "Select a region"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {regions?.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button type="submit" className="w-full md:w-auto">
              Générer PDF
            </Button>
            <Button
              type="button"
              onClick={handleConfirmedPayment}
              className="w-full md:w-auto"
            >
              Confirmer les paiements
            </Button>
          </div>
        </form>
        <hr className="my-4" />
        {utilisateur?.roles === "SUPER_ADMIN_ROLES" && (
        <div className="float-end">
          <a href="/locaux/ajouter">
          <Button className="w-full md:w-auto">
            Ajouter un local
          </Button>
          </a>
        </div>
        )}
        {tableData.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold mb-4 py-2">Listes des Locaux</h1>
            <div className="p-2 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700">
              <DataTable
                columns={updatedColumns}
                data={tableData}
                onRowsSelected={setSelectedRows}
              />
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold mb-4 py-2">Aucun local trouvé</h1>
        )}
      </div>
    </>
  );
}
