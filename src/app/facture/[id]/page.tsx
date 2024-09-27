"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import { getLocal } from "@/app/api/local";
import { Local } from "@/app/type/Local";
import { Paiement } from "@/app/type/Paiement";
import { api } from "@/app/api";
import { toast } from "@/hooks/use-toast";
import { getFactureById } from "@/app/api/paiement";

export default function Home({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [selectedValue, setselectedValue] = useState<Paiement>();

  const { data: facture, isLoading } = useQuery({
    queryKey: ["facture", params.id],
    queryFn: () => getFactureById(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setselectedValue(data);
    },
  });
  const handleSubmit = async (e: any) => {
    console.log(selectedValue);
  };

  return (
    <>
      <section>
        <SideBar />
        <div className="p-4 ml-64 ">
          <BreadCrumb />
          <div className="p-2 mt-5 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
            <section className="bg-white dark:bg-gray-900">
              <div className=" px-4 py-2 mx-auto lg:py-2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Mois
                      </label>
                      <input
                        type="text"
                        name="month"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.month || ""}
                        placeholder="mois"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Année
                      </label>
                      <input
                        type="text"
                        name="year"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.year || ""}
                        placeholder="adresse"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Montant brute mensuel
                      </label>
                      <input
                        type="number"
                        name="bruteMensuel"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.bruteMensuel || ""}
                        placeholder="Montant brute mensuel"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Pourcentage de la RAS
                      </label>
                      <input
                        type="number"
                        name="pourcentageRAS"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.pourcentageRAS || ""}
                        placeholder="Montant brute mensuel"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Montant de la RAS
                      </label>
                      <input
                        type="number"
                        name="ras"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.ras || ""}
                        placeholder="Montant de la RAS"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Montant net mensuel
                      </label>
                      <input
                        type="number"
                        name="netMensuel"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.netMensuel || ""}
                        placeholder="Montant net mensuel"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        etat du mois
                      </label>
                      <input
                        type="number"
                        name="netMensuel"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.etat || ""}
                        placeholder="etat"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="focus:outline-none text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                  >
                    Ajouter
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
