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
import { api } from "../api";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedRegion, setselectedRegion] = useState<Region | null>(null);
  const [tableData, setTableData] = useState<Local[]>([]);
  const [date, setDate] = useState<string>("");

  const { data: regions } = useQuery("regions", getALLRegions);

  useEffect(() => {
    if (selectedRegion) {
      getLocauxByCoordination(selectedRegion.id).then((data) => {
        setTableData(Array.isArray(data) ? data : []);
      });
    }
  }, [selectedRegion]);

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

    if (tableData.length === 0) {
      toast({
        description: "No locals to process.",
        variant: "destructive",
        duration: 3000,
        title: "Error",
      });
      return;
    }

    const payload = {
      locals: tableData.map((local) => ({
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
      const date = payload.date.split("T")[0];
      const mois = date.split("-")[1];
      const year = date.split("-")[0];
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
      link.setAttribute("download", filename); // or the appropriate file name
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
      console.log(payload);
      // Toast error message
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
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Choisissez une Coordination
              </label>
              <select
                name="region1"
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selectedName =
                    e.target.options[e.target.selectedIndex].text;
                  setselectedRegion({ id: selectedId, name: selectedName });
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" selected disabled>
                  {selectedRegion ? selectedRegion.name : "Select a region"}
                </option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="focus:outline-none text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <hr className="my-4" />
        {tableData.length > 0 ? (
          <>
            {/* <Link href={"/locaux/ajouter"}>
              <button
                type="button"
                className="focus:outline-none text-white float-end bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
              >
                Ajouter Local
              </button>
            </Link>*/}
            <h1 className="text-2xl font-bold mb-4 py-2">Listes des Locaux</h1>
            <div className="p-2 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700">
              <DataTable columns={columns} data={tableData} />
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold mb-4 py-2">Aucun local trouvé</h1>
        )}
      </div>
    </>
  );
}
