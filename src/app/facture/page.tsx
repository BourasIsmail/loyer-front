"use client";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Local } from "../../type/Local";
import { Province } from "../../type/Province";
import { Proprietaire } from "../../type/Proprietaire";
import { useQuery } from "react-query";
import { getLocaux } from "../../api/local";
import { columns } from "./columns";
import { getFactureById, getFactureByLocal } from "@/app/api/paiement";
import { useEffect, useState } from "react";

export default function Home() {
  const [local, setLocal] = useState<number | null>(null);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const localParam = Number(queryParameters.get("local"));
    setLocal(localParam);
  }, []);

  const { data: factures } = useQuery({
    queryKey: ["factures"],
    queryFn: () => getFactureByLocal(local as number),
    enabled: !!local,
  });

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64 ">
        <BreadCrumb />
        <Link href={`/locaux/facture/ajouter/?local=${local}`}>
          <button
            type="button"
            className="focus:outline-none  text-white float-end bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          >
            Ajouter facture
          </button>
        </Link>
        <h1 className="text-2xl font-bold mb-4 py-2">Listes des factures</h1>
        <div className="p-2 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700">
          <DataTable columns={columns} data={factures || []} />
        </div>
      </div>
    </>
  );
}
