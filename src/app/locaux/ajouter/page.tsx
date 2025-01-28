"use client";

import { getLocal } from "@/app/api/local";
import { getProprietaires } from "@/app/api/proprietaire";
import { getAllProvinces } from "@/app/api/province";
import { Local } from "@/app/type/Local";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import ReactSelect from "react-select";
import { useState } from "react";
import { useQuery } from "react-query";
import { api, getCurrentUsers } from "@/app/api";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFileDownload } from "react-icons/fa";
import { UserInfo } from "@/app/type/UserInfo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";


export default function Home() {
  const [selectedValue, setSelectedValue] = useState<Local>();
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
      useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

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


  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  });

    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await api.post(`/local/add`, {
        ...selectedValue
      });
      toast({
        title: "Succès",
        description: "Les informations ont été ajoutées avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      });
      router.push("/locaux");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout des informations",
        className: "bg-red-500 text-white",
        duration: 2000,
      });
    }
  };

  const is_User = utilisateur?.roles === "USER_ROLES";
  const is_Observateur = utilisateur?.roles === "OBSERVATEUR_ROLES";


  return (
      <>
        <section>
          <SideBar />
          <div className="p-4 ml-64">
            <BreadCrumb />
            <div className="p-2 mt-5 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
              <section className="bg-white dark:bg-gray-900">
                    <div className="px-4 py-2 mx-auto lg:py-2">
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                          <div className="space-y-2">
                            <Label htmlFor="adresse">Adresse</Label>
                            <Input
                                id="adresse"
                                value={selectedValue?.adresse || ""}
                                onChange={(e) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      adresse: e.target.value,
                                    } as Local)
                                }
                                placeholder="Adresse"
                                disabled={is_Observateur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="brutMensuel">Montant brut</Label>
                            <Input
                                id="brutMensuel"
                                type="number"
                                value={selectedValue?.brutMensuel || ""}
                                onChange={(e) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      brutMensuel: Number(e.target.value),
                                    } as Local)
                                }
                                placeholder="Montant brut mensuel"
                                disabled={is_Observateur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rib">RIB</Label>
                            <Input
                                id="rib"
                                value={selectedValue?.rib || ""}
                                onChange={(e) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      rib: e.target.value,
                                    } as Local)
                                }
                                placeholder="RIB"
                                disabled={is_Observateur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="etat">État du local</Label>
                            <Select
                                value={selectedValue?.etat}
                                disabled={is_Observateur}
                                onValueChange={(value) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      etat: value,
                                    } as Local)
                                }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'état du local" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="résilié">Résilié</SelectItem>
                                <SelectItem value="actif">Actif</SelectItem>
                                <SelectItem value="suspendu">Suspendu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateEffetContrat">
                              Date d'effet de contrat
                            </Label>
                            <Input
                                id="dateEffetContrat"
                                type="date"
                                disabled={is_Observateur}
                                value={selectedValue?.dateEffetContrat || ""}
                                onChange={(e) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      dateEffetContrat: e.target.value,
                                    } as Local)
                                }
                                placeholder="Date d'effet de contrat"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="province">Province</Label>
                            <Select
                                value={selectedValue?.province?.id.toString()}
                                disabled={is_Observateur}
                                onValueChange={(value) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      province: provinces?.find(
                                          (p) => p.id === Number(value)
                                      ),
                                    } as Local)
                                }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une province" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces?.map((province) => (
                                    <SelectItem
                                        key={province.id}
                                        value={province.id.toString()}
                                    >
                                      {province.name}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="proprietaires">Propriétaires</Label>
                            <ReactSelect
                                options={options5}
                                value={selectedValue?.proprietaires?.map((prop) =>
                                    options5.find(
                                        (option) => option.value === prop.id
                                    )
                                )}
                                onChange={(selectedOption) => {
                                  setSelectedValue({
                                    ...selectedValue,
                                    proprietaires: selectedOption.map(
                                        (option: any) => ({
                                          id: option.value,
                                          nom: option.label,
                                        })
                                    ),
                                  } as Local);
                                }}
                                placeholder="Propriétaires"
                                isMulti
                                classNamePrefix="react-select"
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused
                                        ? "hsl(var(--ring))"
                                        : "hsl(var(--input))",
                                    "&:hover": {
                                      borderColor: "hsl(var(--ring))",
                                    },
                                    boxShadow: state.isFocused
                                        ? "0 0 0 2px hsl(var(--ring))"
                                        : "none",
                                    backgroundColor: "hsl(var(--background))",
                                  }),
                                  menu: (baseStyles) => ({
                                    ...baseStyles,
                                    backgroundColor: "hsl(var(--background))",
                                  }),
                                  option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isSelected
                                        ? "hsl(var(--primary))"
                                        : "hsl(var(--background))",
                                    color: state.isSelected
                                        ? "hsl(var(--primary-foreground))"
                                        : "hsl(var(--foreground))",
                                    "&:hover": {
                                      backgroundColor: "hsl(var(--accent))",
                                      color: "hsl(var(--accent-foreground))",
                                    },
                                  }),
                                }}
                                isDisabled={is_Observateur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="modeDePaiement">
                              Mode de paiement
                            </Label>
                            <Select
                                value={selectedValue?.modeDePaiement}
                                disabled={is_Observateur}
                                onValueChange={(value) =>
                                    setSelectedValue({
                                      ...selectedValue,
                                      modeDePaiement: value,
                                    } as Local)
                                }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le mode de paiement" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="virement">Virement</SelectItem>
                                <SelectItem value="Chèque">Chèque</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                        </div>
                        <div className="flex justify-start items-end gap-3">
                          <Button disabled={is_Observateur} type="submit">
                            Ajouter les informations
                          </Button>
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
