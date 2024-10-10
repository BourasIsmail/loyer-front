"use client";
import { getLocal } from "@/app/api/local";
import { getProprietaire, getProprietaires } from "@/app/api/proprietaire";
import { getAllProvinces } from "@/app/api/province";
import { Local } from "@/app/type/Local";
import { Proprietaire } from "@/app/type/Proprietaire";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import Select from "react-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "@/app/api";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFileDownload } from "react-icons/fa";

export default function Home({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [selectedValue, setselectedValue] = useState<Local>();

  const { data: proprietaires } = useQuery({
    queryKey: ["allProprietaires"],
    queryFn: getProprietaires,
  });
  const options5 = (Array.isArray(proprietaires) ? proprietaires : []).map(
    (prop) => ({
      value: prop.id,
      label: prop.nomComplet,
    })
  );
  const { data: local, isLoading } = useQuery({
    queryKey: ["local", params.id],
    queryFn: () => getLocal(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setselectedValue(data);
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  });

  const registerFile = (e: any) => {
    try {
      e.preventDefault();
      const fd = new FormData();
      if (selectedValue?.contrat) {
        fd.append("file", selectedValue.contrat);
      }
      const response = api
        .put(`/local/upload/${selectedValue?.id}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(response);
        });
      toast({
        description: "Télechargement du contrat avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Success",
      });
    } catch (error) {
      toast({
        description: "Erreur lors du téléchargement du contrat",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedValue?.rib?.replace(/\s+/g, "").length !== 24) {
        toast({
          title: "Erreur",
          description: "Le rib doit contenir 24 caractères",
          className: "bg-red-500 text-white",
          duration: 2000,
        });
        return;
      }
      const response = await api.put(
        `/local/update/${params.id}`,
        selectedValue
      );
      toast({
        title: "Succès",
        description: "Les informations ont été modifiées avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification des informations",
        className: "bg-red-500 text-white",
        duration: 2000,
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
              <Tabs defaultValue="info" className="px-2">
                <TabsList
                  defaultValue="info"
                  className="grid w-full grid-cols-2"
                >
                  <TabsTrigger value="info">Informations du local</TabsTrigger>
                  <TabsTrigger value="contract">Contact</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  <div className=" px-4 py-2 mx-auto lg:py-2">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adresse
                          </label>
                          <input
                            type="text"
                            name="nom"
                            id=""
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={selectedValue?.adresse || ""}
                            placeholder="Nom"
                            onChange={(e) =>
                              setselectedValue({
                                ...selectedValue,
                                adresse: e.target.value || "",
                              })
                            }
                            required
                          />
                        </div>
                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Montant brute
                          </label>
                          <input
                            type="number"
                            name="brutMensuel"
                            id=""
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={selectedValue?.brutMensuel || ""}
                            placeholder="brut Mensuel"
                            onChange={(e) =>
                              setselectedValue({
                                ...selectedValue,
                                brutMensuel: Number(e.target.value) || 0,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            rib
                          </label>
                          <input
                            type="text"
                            name="rib"
                            id=""
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={selectedValue?.rib || ""}
                            placeholder="rib"
                            onChange={(e) =>
                              setselectedValue({
                                ...selectedValue,
                                rib: e.target.value || "",
                              })
                            }
                            required
                          />
                        </div>
                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Etat du local
                          </label>
                          <select
                            name="etat"
                            onChange={(e) =>
                              setselectedValue({
                                ...selectedValue,
                                etat: e.target.value || "",
                              })
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option defaultValue={selectedValue?.etat || ""}>
                              {selectedValue?.etat || "Etat du local"}
                            </option>
                            <option value="résilié">Résilié</option>
                            <option value="actif">Actif</option>
                            <option value="suspendu">Suspendu</option>
                          </select>
                        </div>
                        <div className="w-full">
                          <div className="relative z-0 w-full mb-5 group">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Province
                            </label>
                            <select
                              name="province"
                              onChange={(e) =>
                                setselectedValue({
                                  ...selectedValue,
                                  province:
                                    provinces?.find(
                                      (item) =>
                                        item.id === Number(e.target.value)
                                    ) || undefined,
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option
                                defaultValue={selectedValue?.province?.id || ""}
                              >
                                {selectedValue?.province?.name || ""}
                              </option>
                              {provinces?.map((province) => (
                                <option value={province.id}>
                                  {province.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="w-full">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Propriaires
                          </label>
                          <Select
                            options={options5}
                            value={selectedValue?.proprietaires?.map((prop) =>
                              options5.find(
                                (option) => option.value === prop.id
                              )
                            )}
                            onChange={(selectedOption) => {
                              setselectedValue({
                                ...selectedValue,
                                proprietaires: selectedOption.map(
                                  (option: any) => ({
                                    id: option.value,
                                    nom: option.label,
                                  })
                                ),
                              });
                            }}
                            placeholder="Proprietaires"
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="flex justify-start items-end gap-3">
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Modifier les informations
                        </button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="contract">
                  <div className=" px-4 py-2 mx-auto lg:py-2">
                    <form onSubmit={registerFile} encType="multipart/form-data">
                      <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <div className="flex flex-row">
                              Contract:
                              {selectedValue?.fileName ? (
                                <a
                                  href={`http://172.16.20.58:81/local/download/${selectedValue.id}`}
                                  className="text-blue-500"
                                >
                                  <FaFileDownload />
                                </a>
                              ) : null}
                            </div>
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    {selectedValue?.fileName}
                                    Telecharger contrat
                                  </span>{" "}
                                  drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF
                                </p>
                              </div>
                              <input
                                id="dropzone-file"
                                type="file"
                                onChange={(e) =>
                                  setselectedValue({
                                    ...selectedValue,
                                    contrat: e.target.files?.[0] || undefined,
                                    fileName: e.target.files?.[0].name || "",
                                  })
                                }
                                className="hidden"
                                name="demande"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start items-end gap-3">
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Télécharger le contrat
                        </button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
