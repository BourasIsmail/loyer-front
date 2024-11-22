"use client";

import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "@/components/ui/data-table";
import { getLocauxByCoordination } from "@/app/api/local";
import { getALLRegions } from "@/app/api/region";
import { Region } from "@/app/type/Region";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Local } from "@/app/type/Local";
import { api } from "@/app/api";
import { columns } from "../columns";
import { ComptePayement } from "@/app/type/ComptePayement";
import { getComptes } from "@/app/api/comptePayement";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [tableData, setTableData] = useState<Local[]>([]);
  const [selectedRows, setSelectedRows] = useState<Local[]>([]);
  const [date, setDate] = useState<string>("");
  const [nOrdre, setNOrdre] = useState<string>("");
  const [nOP, setNOP] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [dateCreation, setDateCreation] = useState<string>("");
  const [comptePaiement, setComptePaiement] = useState<ComptePayement | null>(
    null
  );

  const { data: regions } = useQuery("regions", getALLRegions);
  const { data: comptes } = useQuery("comptePaiement", getComptes);

  useEffect(() => {
    if (selectedRegion) {
      getLocauxByCoordination(selectedRegion.id).then((data) => {
        setTableData(Array.isArray(data) ? data : []);
      });
    }
  }, [selectedRegion]);

  const formatDateForAPI = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedRegion ||
      !date ||
      !nOrdre ||
      !comptePaiement ||
      !nOP ||
      !mode ||
      !dateCreation
    ) {
      toast({
        description: "Please fill in all fields.",
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
      date: `${formatDateForAPI(date)}T00:00:00`,
      nOrdre: nOrdre,
      nOP: nOP,
      dateCreation: formatDateForAPI(dateCreation),
      comptePaiement: comptePaiement,
      mode: mode,
    };

    try {
      const response = await api.post("/Paiement/ov", payload, {
        responseType: "blob",
      });
      const dateObj = new Date(formatDateForAPI(date));
      const mois = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear();
      const filename =
        payload.locals[0].province?.region.name +
        "_" +
        mois +
        "_" +
        year +
        ".pdf";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        description: "Télechargement réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "Erreur lors du téléchargement",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Choisissez une Coordination</Label>
              <Select
                onValueChange={(value) => {
                  const selectedRegion = regions?.find(
                    (r) => r.id.toString() === value
                  );
                  if (selectedRegion) {
                    setSelectedRegion(selectedRegion);
                  }
                }}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select a region" />
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
              <Label htmlFor="date">Date (DD-MM-YYYY)</Label>
              <Input
                id="date"
                type="date"
                value={formatDateForDisplay(date)}
                onChange={(e) => setDate(e.target.value)}
                required
                max="9999-12-31"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nOrdre">N° Ordre de virement</Label>
              <Input
                id="nOrdre"
                type="number"
                value={nOrdre}
                onChange={(e) => setNOrdre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comptePaiement">Choisissez un compte</Label>
              <Select
                onValueChange={(value) => {
                  const compte =
                    comptes?.find((r) => r?.id?.toString() === value) || null;
                  setComptePaiement(compte);
                }}
              >
                <SelectTrigger id="comptePaiement">
                  <SelectValue placeholder="Choisissez un compte" />
                </SelectTrigger>
                <SelectContent>
                  {comptes?.map((c) => (
                    <SelectItem key={c.id} value={c?.id?.toString() || ""}>
                      {c.numCompte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nOP">N° OP</Label>
              <Input
                id="nOP"
                type="number"
                value={nOP}
                onChange={(e) => setNOP(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateCreation">
                Date de création (DD-MM-YYYY)
              </Label>
              <Input
                id="dateCreation"
                type="date"
                value={formatDateForDisplay(dateCreation)}
                onChange={(e) => setDateCreation(e.target.value)}
                required
                max="9999-12-31"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mode">Choisissez un mode de paiement</Label>
              <Select onValueChange={(value) => setMode(value)} required>
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Choisissez un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mois">Mois</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            Submit
          </Button>
        </form>

        <hr className="my-4" />
        {tableData.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold mb-4 py-2">Listes des Locaux</h1>
            <div className="p-2 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700">
              <DataTable
                columns={columns}
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
