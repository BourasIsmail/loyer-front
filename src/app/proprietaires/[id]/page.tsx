"use client";
import { api, getCurrentUsers } from "@/app/api";
import { getProprietaire } from "@/app/api/proprietaire";
import { getAllProvinces } from "@/app/api/province";
import { Proprietaire } from "@/app/type/Proprietaire";
import { UserInfo } from "@/app/type/UserInfo";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
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
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Home({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [selectedValue, setselectedValue] = useState<Proprietaire>();
  const [open, setopen] = useState(false);

  const { data: proprietaire, isLoading } = useQuery({
    queryKey: ["benef", params.id],
    queryFn: () => getProprietaire(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setselectedValue(data);
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  });

  const handleSubmit = async () => {
    try {
      const response = await api.put(
        `/Proprietaire/update/${params.id}`,
        selectedValue
      );
      toast({
        title: "Succès",
        description: "Les informations ont été modifiées avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification des informations",
        className: "bg-red-500 text-white",
        duration: 2000,
      });
    }
  };
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UserInfo | null>(null);
  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>(
    "utilisateur",
    getCurrentUsers,
    {
      onSuccess: (data) => {
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
  const is_Observateur = utilisateur?.roles === "OBSERVATEUR_ROLES";
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
                        Nom
                      </label>
                      <input
                        type="text"
                        name="nom"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.nomComplet || ""}
                        placeholder="Nom"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            nomComplet: e.target.value || "",
                          })
                        }
                        disabled={is_Observateur}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Type de propriétaire
                      </label>
                      <select
                        name="type"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.type || ""}
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            type: e.target.value || "",
                          })
                        }
                        disabled={is_Observateur}
                      >
                        <option value="">Choisissez un type</option>
                        <option value="personne physique">Physique</option>
                        <option value="personne morale">Morale</option>
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
                                  (item) => item.id === Number(e.target.value)
                                ) || undefined,
                            })
                          }
                          disabled={is_Observateur}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option
                            defaultValue={selectedValue?.province?.id || ""}
                            disabled
                          >
                            {selectedValue?.province?.name || ""}
                          </option>
                          {provinces?.map((province) => (
                            <option value={province.id}>{province.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        CIN / IEF
                      </label>
                      <input
                        type="text"
                        name="cin"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.cin || ""}
                        placeholder="CIN"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            cin: e.target.value || "",
                          })
                        }
                        disabled={is_Observateur}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Telephone
                      </label>
                      <input
                        type="text"
                        name="telephone"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.telephone || ""}
                        placeholder="XXXXXXXXXX"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            telephone: e.target.value || "",
                          })
                        }
                        disabled={is_Observateur}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        id=""
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={selectedValue?.adresse || ""}
                        placeholder="votre adresse"
                        onChange={(e) =>
                          setselectedValue({
                            ...selectedValue,
                            adresse: e.target.value || "",
                          })
                        }
                        disabled={is_Observateur}
                      />
                    </div>
                  </div>
                  <div className="flex justify-start items-end gap-3">
                    <button
                      type="submit"
                      disabled={is_Observateur}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Modifier les informations
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
