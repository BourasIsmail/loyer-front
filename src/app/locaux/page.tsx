"use client";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Local } from "../type/Local";
import { Province } from "../type/Province";
import { Proprietaire } from "../type/Proprietaire";
import { useQuery } from "react-query";
import { getLocal, getLocaux, getLocauxByCoordination } from "../api/local";
import { Region } from "../type/Region";
import { useState } from "react";
import { getALLRegions, getRegion } from "../api/region";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const params = useSearchParams();
  const code = params.get("code");
  const [selectedRegion, setselectedRegion] = useState<Region>();

  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => getALLRegions(),
  });

  const [search, setsearch] = useState<Region>();
  const { data: region, isLoading } = useQuery({
    queryKey: ["region"],
    queryFn: () => getRegion(selectedRegion?.id as number),
    enabled: !!selectedRegion,
    onSuccess: (data) => {
      setsearch(data);
    },
  });
  const { data: locaux } = useQuery({
    queryKey: ["locaux"],
    queryFn: () => getLocauxByCoordination(search?.id as number),
    enabled: !!search,
  });

  const router = useRouter();
  const handleSearch = () => {
    if (search?.id == null) {
      router.push(`/locaux`);
    }
    router.push(`/locaux?code=${search?.id}`);
  };

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64 ">
        <BreadCrumb />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 sm:mb-5">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Choisissez une Coordination
            </label>
            <select
              name="region1"
              onChange={(value) => {
                setselectedRegion({
                  ...selectedRegion,
                  id: Number(value.target.value),
                  name: value.target.value.toString(),
                });
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={search?.id} selected>
                {search ? search.name : "Select a region"}
              </option>

              {regions?.map((region) => (
                <option value={region.id}>{region.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="focus:outline-none  text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          >
            Rechercher
          </button>
        </div>

        {locaux ? (
          <>
            <Link href={"/locaux/ajouter"}>
              <button
                type="button"
                className="focus:outline-none  text-white float-end bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
              >
                Ajouter Local
              </button>
            </Link>
            <h1 className="text-2xl font-bold mb-4 py-2">Listes des Locaux</h1>
            <div className="p-2 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700">
              <DataTable columns={columns} data={[]} />
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold mb-4 py-2">Aucun local trouvé</h1>
        )}
      </div>
    </>
  );
}
