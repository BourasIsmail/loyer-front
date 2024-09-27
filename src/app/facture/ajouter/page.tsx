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

export default function Home() {
  const [local, setLocal] = useState<number | null>(null);
  const [selectedLocal, setselectedLocal] = useState<Local>();

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const localParam = Number(queryParameters.get("local"));
    setLocal(localParam);
  }, []);

  const { data: nLocal, isLoading } = useQuery({
    queryKey: ["local", local],
    queryFn: () => getLocal(local as number),
    enabled: !!local,
    onSuccess: (data) => {
      setselectedLocal(data);
    },
  });

  const [selectedValue, setselectedValue] = useState<Paiement>();

  useEffect(() => {
    if (selectedLocal) {
      setselectedValue((prevValue) => ({
        ...prevValue,
        local: selectedLocal,
      }));
    }
  }, [selectedLocal]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.post(`/Paiement/add`, selectedValue);
      console.log(response);
      toast({
        description: "Ajouter avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      });
    } catch (error) {
      toast({
        description: "Veuillez réessayer",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
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
                        Date
                      </label>
                      <input
                        type="date"
                        name="dateCreation"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.dateCreation || ""}
                        placeholder="date"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            dateCreation: e.target.value || "",
                          })
                        }
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Adresse du Local
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedLocal?.adresse || ""}
                        placeholder="adresse"
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
