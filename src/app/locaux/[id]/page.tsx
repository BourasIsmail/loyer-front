"use client"

import type React from "react"
import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { useQuery } from "react-query"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { getLocal } from "@/app/api/local"
import { getProprietaires } from "@/app/api/proprietaire"
import { getAllProvinces } from "@/app/api/province"
import { api, getCurrentUsers } from "@/app/api"
import type { Local } from "@/app/type/Local"
import type { UserInfo } from "@/app/type/UserInfo"
import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import ReactSelect from "react-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaFileDownload, FaMapMarkerAlt, FaHome, FaFileContract, FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"

// Import other necessary components...

const MapComponent = dynamic(() => import("@/components/map-componenet"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export default function Home({
                               params,
                             }: {
  params: {
    id: number
  }
}) {
  const router = useRouter()
  const [selectedValue, setSelectedValue] = useState<Local>()
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<UserInfo | null>(null)
  const [latitude, setLatitude] = useState(34.0218)
  const [longitude, setLongitude] = useState(-6.82731)
  const [zoom, setZoom] = useState(13)
  const [error, setError] = useState<string | null>(null)
  const [newLatitude, setNewLatitude] = useState<number | null>(null)
  const [newLongitude, setNewLongitude] = useState<number | null>(null)
  const [mapKey, setMapKey] = useState(0) // Add this line to create a key for the MapComponent

  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>("utilisateur", getCurrentUsers, {
    onSuccess: (data) => {
      setUtilisateurSelectionne(data)
    },
    onError: (error) => {
      toast({
        description: "Erreur lors de la récupération des données utilisateur",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    },
  })

  const { data: proprietaires } = useQuery({
    queryKey: ["allProprietaires"],
    queryFn: getProprietaires,
  })

  const options5 = (Array.isArray(proprietaires) ? proprietaires : []).map((prop) => ({
    value: prop.id,
    label: prop.nomComplet,
  }))

  const { data: local, isLoading } = useQuery({
    queryKey: ["local", params.id],
    queryFn: () => getLocal(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setSelectedValue(data)
      if (data?.latitude && data?.longitude) {
        setLatitude(data.latitude)
        setLongitude(data.longitude)
      }
    },
  })

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  })

  const registerFile = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      if (selectedValue?.contrat) {
        fd.append("file", selectedValue.contrat)
      }
      api
          .put(`/local/upload/${selectedValue?.id}`, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res)
            toast({
              description: "Télechargement du contrat avec succès",
              className: "bg-green-500 text-white",
              duration: 3000,
              title: "Success",
            })
          })
    } catch (error) {
      toast({
        description: "Erreur lors du téléchargement du contrat",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedValue?.rib?.replace(/\s+/g, "").length !== 24) {
        toast({
          title: "Erreur",
          description: "Le rib doit contenir 24 caractères",
          className: "bg-red-500 text-white",
          duration: 2000,
        })
        return
      }
      await api.put(`/local/update/${params.id}`, {
        ...selectedValue,
        latitude,
        longitude,
      })
      toast({
        title: "Succès",
        description: "Les informations ont été modifiées avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification des informations",
        className: "bg-red-500 text-white",
        duration: 2000,
      })
    }
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewLatitude(lat)
    setNewLongitude(lng)
  }, [])

  const updateLocation = useCallback(async () => {
    try {
      await api.put(`/local/update/${params.id}`, {
        ...selectedValue,
        latitude: newLatitude ?? latitude,
        longitude: newLongitude ?? longitude,
      })
      setSelectedValue(
          (prev) =>
              ({
                ...prev,
                latitude: newLatitude ?? latitude,
                longitude: newLongitude ?? longitude,
              }) as Local,
      )
      setLatitude(newLatitude ?? latitude)
      setLongitude(newLongitude ?? longitude)
      setNewLatitude(null)
      setNewLongitude(null)
      setMapKey((prevKey) => prevKey + 1) // Increment the key to force re-render
      toast({
        title: "Succès",
        description: "Les coordonnées ont été mises à jour avec succès",
        className: "bg-green-500 text-white",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des coordonnées",
        className: "bg-red-500 text-white",
        duration: 2000,
      })
    }
  }, [params.id, selectedValue, newLatitude, newLongitude, latitude, longitude])

  const is_User = utilisateur?.roles === "USER_ROLES"
  const is_Observateur = utilisateur?.roles === "OBSERVATEUR_ROLES"
  const is_Super_Admin = utilisateur?.roles === "SUPER_ADMIN_ROLES"

  if (isLoading || isLoadingUser) {
    return <div>Chargement...</div>
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
          >
            <FaArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <BreadCrumb />
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FaHome className="h-6 w-6" />
              Détails du Local - {selectedValue?.adresse}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none border-b">
                <TabsTrigger
                  value="info"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <FaHome className="h-4 w-4" />
                  Informations du local
                </TabsTrigger>
                <TabsTrigger
                  value="contract"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <FaFileContract className="h-4 w-4" />
                  Contrat
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  <FaMapMarkerAlt className="h-4 w-4" />
                  Localisation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="adresse" className="text-sm font-medium text-gray-700">
                        Adresse
                      </Label>
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
                        disabled={!is_Super_Admin}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brutMensuel" className="text-sm font-medium text-gray-700">
                        Montant brut
                      </Label>
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
                        disabled={!is_Super_Admin}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rib" className="text-sm font-medium text-gray-700">
                        RIB
                      </Label>
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
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="etat" className="text-sm font-medium text-gray-700">
                        État du local
                      </Label>
                      <Select
                        value={selectedValue?.etat}
                        disabled={!is_Super_Admin}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            etat: value,
                          } as Local)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                      <Label htmlFor="dateResiliation" className="text-sm font-medium text-gray-700">
                        Date de résiliation
                      </Label>
                      <Input
                        id="dateResiliation"
                        type="date"
                        disabled={is_Observateur}
                        value={selectedValue?.dateResiliation || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            dateResiliation: e.target.value,
                          } as Local)
                        }
                        placeholder="Date de résiliation"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateEffetContrat" className="text-sm font-medium text-gray-700">
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
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                        Province
                      </Label>
                      <Select
                        value={selectedValue?.province?.id.toString()}
                        disabled={!is_Super_Admin}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            province: provinces?.find((p) => p.id === Number(value)),
                          } as Local)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez une province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces?.map((province) => (
                            <SelectItem key={province.id} value={province.id.toString()}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proprietaires" className="text-sm font-medium text-gray-700">
                        Propriétaires
                      </Label>
                      <ReactSelect
                        options={options5}
                        value={selectedValue?.proprietaires?.map((prop) =>
                          options5.find((option) => option.value === prop.id),
                        )}
                        onChange={(selectedOption) => {
                          setSelectedValue({
                            ...selectedValue,
                            proprietaires: selectedOption.map((option: any) => ({
                              id: option.value,
                              nom: option.label,
                            })),
                          } as Local)
                        }}
                        placeholder="Propriétaires"
                        isMulti
                        classNamePrefix="react-select"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                            "&:hover": {
                              borderColor: "#3b82f6",
                            },
                            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                            backgroundColor: "white",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "white",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isSelected ? "#3b82f6" : "white",
                            color: state.isSelected ? "white" : "#374151",
                            "&:hover": {
                              backgroundColor: "#eff6ff",
                              color: "#1f2937",
                            },
                          }),
                        }}
                        isDisabled={!is_Super_Admin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modeDePaiement" className="text-sm font-medium text-gray-700">
                        Mode de paiement
                      </Label>
                      <Select
                        value={selectedValue?.modeDePaiement}
                        disabled={!is_Super_Admin}
                        onValueChange={(value) =>
                          setSelectedValue({
                            ...selectedValue,
                            modeDePaiement: value,
                          } as Local)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez le mode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virement">Virement</SelectItem>
                          <SelectItem value="Chèque">Chèque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idContrat" className="text-sm font-medium text-gray-700">
                        ID de contrat
                      </Label>
                      <Input
                        id="idContrat"
                        value={selectedValue?.idContrat || ""}
                        disabled={!is_Super_Admin}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            idContrat: e.target.value,
                          } as Local)
                        }
                        placeholder="ID de contrat"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ancientBrute" className="text-sm font-medium text-gray-700">
                        Ancien Brut
                      </Label>
                      <Input
                        id="ancientBrute"
                        type="number"
                        disabled={!is_Super_Admin}
                        value={selectedValue?.ancientBrute || ""}
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            ancientBrute: Number(e.target.value),
                          } as Local)
                        }
                        placeholder="Ancien montant brut"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateChangementBrute" className="text-sm font-medium text-gray-700">
                        Date de changement du brut
                      </Label>
                      <Input
                        id="dateChangementBrute"
                        type="date"
                        disabled={!is_Super_Admin}
                        value={
                          selectedValue?.dateChangementBrute
                            ? new Date(selectedValue.dateChangementBrute).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedValue({
                            ...selectedValue,
                            dateChangementBrute: new Date(e.target.value),
                          } as Local)
                        }
                        placeholder="Date de changement du brut"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-start pt-4">
                    <Button
                      disabled={!is_Super_Admin}
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200"
                    >
                      Modifier les informations
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="contract" className="p-6">
                <form onSubmit={registerFile} encType="multipart/form-data" className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="contract" className="text-lg font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaFileContract className="h-5 w-5 text-blue-600" />
                        Contrat:
                        {selectedValue?.fileName && (
                          <a
                            href={`http://172.16.20.58:81/local/download/${selectedValue.id}`}
                            className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaFileDownload className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-blue-500"
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
                          <p className="mb-2 text-sm text-blue-600">
                            <span className="font-semibold">{selectedValue?.fileName || "Télécharger contrat"}</span> ou
                            glisser-déposer
                          </p>
                          <p className="text-xs text-blue-500">PDF</p>
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
                          disabled={!is_Super_Admin}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-start pt-4">
                    <Button
                      disabled={!is_Super_Admin}
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200"
                    >
                      Télécharger le contrat
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="map" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Localisation</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(Number(e.target.value))}
                        required
                        aria-describedby="latitude-description"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p id="latitude-description" className="text-sm text-gray-500">
                        Entrez une valeur entre -90 et 90
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(Number(e.target.value))}
                        required
                        aria-describedby="longitude-description"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p id="longitude-description" className="text-sm text-gray-500">
                        Entrez une valeur entre -180 et 180
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zoom" className="text-sm font-medium text-gray-700">
                        Niveau de zoom
                      </Label>
                      <Input
                        id="zoom"
                        type="number"
                        min="1"
                        max="19"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        required
                        aria-describedby="zoom-description"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p id="zoom-description" className="text-sm text-gray-500">
                        Entrez une valeur entre 1 et 19
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={updateLocation}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-200"
                  >
                    Mettre à jour la carte
                  </Button>
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erreur</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <MapComponent
                      key={mapKey}
                      latitude={latitude}
                      longitude={longitude}
                      zoom={zoom}
                      onMapClick={handleMapClick}
                    />
                  </div>
                  {newLatitude && newLongitude && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      Nouvelle position sélectionnée : {newLatitude.toFixed(6)}, {newLongitude.toFixed(6)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Cliquez sur la carte pour sélectionner une nouvelle position
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


