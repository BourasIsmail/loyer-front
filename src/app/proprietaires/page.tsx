"use client";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Proprietaire } from "../type/Proprietaire";
import Link from "next/link";
import { useQuery } from "react-query";
import { getProprietaires } from "../api/proprietaire";

export default function Home() {
  const { data: proprietaires } = useQuery({
    queryKey: ["allProprietaires"],
    queryFn: getProprietaires,
  });

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <Link href={"proprietaires/ajouter"}>
          <button
            type="button"
            className="focus:outline-none  text-white float-end bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          >
            Ajouter Proprietaires
          </button>
        </Link>
        <h1 className="text-2xl font-bold mb-4 py-2">
          Listes des Proprietaires
        </h1>
        <div className="p-2 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
          <DataTable columns={columns} data={proprietaires || []} />
        </div>
      </div>
    </>
  );
}
