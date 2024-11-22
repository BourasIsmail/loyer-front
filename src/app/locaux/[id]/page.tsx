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
import dynamic from "next/dynamic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/map-componenet"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [selectedValue, setSelectedValue] = useState<Local>();
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UserInfo | null>(null);
  const [latitude, setLatitude] = useState(34.0218);
  const [longitude, setLongitude] = useState(-6.82731);
  const [zoom, setZoom] = useState(19);
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

  const { data: local, isLoading } = useQuery({
    queryKey: ["local", params.id],
    queryFn: () => getLocal(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setSelectedValue(data);
      if (data?.latitude && data?.longitude) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      }
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  });

  const registerFile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (selectedValue?.contrat) {
        fd.append("file", selectedValue.contrat);
      }
      api
        .put(`/local/upload/${selectedValue?.id}`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          toast({
            description: "Télechargement du contrat avec succès",
            className: "bg-green-500 text-white",
            duration: 3000,
            title: "Success",
          });
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
      await api.put(`/local/update/${params.id}`, {
        ...selectedValue,
        latitude,
        longitude,
      });
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

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setSelectedValue(
      (prev) => ({ ...prev, latitude: lat, longitude: lng } as Local)
    );
  };

  const is_User = utilisateur?.roles === "USER_ROLES";

  if (isLoading || isLoadingUser) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <section>
        <SideBar />
        <div className="p-4 ml-64">
          <BreadCrumb />
          <div className="p-2 mt-5 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
            <section className="bg-white dark:bg-gray-900">
              <Tabs defaultValue="info" className="px-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informations du local</TabsTrigger>
                  <TabsTrigger value="contract">Contrat</TabsTrigger>
                  <TabsTrigger value="map">Localisation</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
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
                            disabled={!is_User}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="etat">État du local</Label>
                          <Select
                            value={selectedValue?.etat}
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
                          <Label htmlFor="dateResiliation">
                            Date de résiliation
                          </Label>
                          <Input
                            id="dateResiliation"
                            type="date"
                            value={selectedValue?.dateResiliation || ""}
                            onChange={(e) =>
                              setSelectedValue({
                                ...selectedValue,
                                dateResiliation: e.target.value,
                              } as Local)
                            }
                            placeholder="Date de résiliation"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateEffetContrat">
                            Date d'effet de contrat
                          </Label>
                          <Input
                            id="dateEffetContrat"
                            type="date"
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="modeDePaiement">
                            Mode de paiement
                          </Label>
                          <Select
                            value={selectedValue?.modeDePaiement}
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
                        <div className="space-y-2">
                          <Label htmlFor="idContrat">ID de contrat</Label>
                          <Input
                            id="idContrat"
                            value={selectedValue?.idContrat || ""}
                            onChange={(e) =>
                              setSelectedValue({
                                ...selectedValue,
                                idContrat: e.target.value,
                              } as Local)
                            }
                            placeholder="ID de contrat"
                          />
                        </div>
                      </div>
                      <div className="flex justify-start items-end gap-3">
                        <Button type="submit">Modifier les informations</Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="contract">
                  <div className="px-4 py-2 mx-auto lg:py-2">
                    <form onSubmit={registerFile} encType="multipart/form-data">
                      <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div>
                          <Label htmlFor="contract" className="mb-2">
                            <div className="flex flex-row items-center">
                              Contract:
                              {selectedValue?.fileName && (
                                <a
                                  href={`http://172.16.20.58:81/local/download/${selectedValue.id}`}
                                  className="ml-2 text-blue-500"
                                >
                                  <FaFileDownload />
                                </a>
                              )}
                            </div>
                          </Label>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
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
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    {selectedValue?.fileName ||
                                      "Télécharger contrat"}
                                  </span>{" "}
                                  ou glisser-déposer
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF
                                </p>
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                onChange={(e) =>
                                  setSelectedValue({
                                    ...selectedValue,
                                    contrat: e.target.files?.[0],
                                    fileName: e.target.files?.[0]?.name || "",
                                  } as Local)
                                }
                                className="hidden"
                                name="demande"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start items-end gap-3">
                        <Button type="submit">Télécharger le contrat</Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="map">
                  <div className="container mx-auto p-4 space-y-4">
                    <h2 className="text-2xl font-bold">Localisation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(Number(e.target.value))}
                          required
                          aria-describedby="latitude-description"
                        />
                        <p
                          id="latitude-description"
                          className="text-sm text-gray-500"
                        >
                          Entrez une valeur entre -90 et 90
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(Number(e.target.value))}
                          required
                          aria-describedby="longitude-description"
                        />
                        <p
                          id="longitude-description"
                          className="text-sm text-gray-500"
                        >
                          Entrez une valeur entre -180 et 180
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zoom">Niveau de zoom</Label>
                        <Input
                          id="zoom"
                          type="number"
                          min="1"
                          max="19"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          required
                          aria-describedby="zoom-description"
                        />
                        <p
                          id="zoom-description"
                          className="text-sm text-gray-500"
                        >
                          Entrez une valeur entre 1 et 19
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          await api.put(`/local/update/${params.id}`, {
                            ...selectedValue,
                            latitude,
                            longitude,
                          });
                          setSelectedValue(
                            (prev) =>
                              ({
                                ...prev,
                                latitude: latitude,
                                longitude: longitude,
                              } as Local)
                          );
                          toast({
                            title: "Succès",
                            description:
                              "Les coordonnées ont été mises à jour avec succès",
                            className: "bg-green-500 text-white",
                            duration: 2000,
                          });
                        } catch (error) {
                          toast({
                            title: "Erreur",
                            description:
                              "Erreur lors de la mise à jour des coordonnées",
                            className: "bg-red-500 text-white",
                            duration: 2000,
                          });
                        }
                      }}
                    >
                      Mettre à jour la carte
                    </Button>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <MapComponent
                      latitude={latitude}
                      longitude={longitude}
                      zoom={zoom}
                      onMapClick={handleMapClick}
                    />
                    <p className="text-sm text-gray-500">
                      Cliquez sur la carte pour mettre à jour les coordonnées
                    </p>
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
