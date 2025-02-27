"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Proprietaire } from "@/app/type/Proprietaire";
import { getAllProvinces } from "@/app/api/province";
import { toast } from "@/hooks/use-toast";
import { api } from "@/app/api";
import { useRouter } from "next/navigation";

export function AddProprietaireFormComponent() {
  const [proprietaire, setProprietaire] = useState<Proprietaire>({
    nomComplet: "",
    cin: "",
    telephone: "",
    adresse: "",
    type: "",
    rib: [],
    province: undefined,
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });

  const handleChange = (field: keyof Proprietaire, value: any) => {
    setProprietaire((prev) => ({ ...prev, [field]: value }));
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(proprietaire);
      const response = await api.post(`/Proprietaire/add`, proprietaire);
      console.log(response);
      toast({
        description: "Ajouté avec succès",
        className: "bg-green-500 text-white",
        duration: 3000,
        title: "Succès",
      });
      router.push("/proprietaires");
    } catch (error) {
      let errorMessage = "Une erreur est survenue lors de l'ajout";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "toString" in error
      ) {
        errorMessage = error.toString();
      }
      toast({
        description: "erreur lors de l'ajouts",
        variant: "destructive",
        duration: 5000,
        title: "Erreur",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nomComplet">Nom Complet</Label>
          <Input
            id="nomComplet"
            placeholder="Nom Complet"
            value={proprietaire.nomComplet || ""}
            onChange={(e) => handleChange("nomComplet", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cin">CIN / IEF</Label>
          <Input
            id="cin"
            placeholder="CIN"
            value={proprietaire.cin || ""}
            onChange={(e) => handleChange("cin", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            placeholder="Téléphone"
            value={proprietaire.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            placeholder="Adresse"
            value={proprietaire.adresse || ""}
            onChange={(e) => handleChange("adresse", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={proprietaire.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personne physique">Physique</SelectItem>
              <SelectItem value="personne morale">Morale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Select
            value={proprietaire.province?.id?.toString()}
            onValueChange={(value) => {
              const selectedProvince = provinces?.find(
                (p) => p.id === Number(value)
              );
              handleChange("province", selectedProvince);
            }}
          >
            <SelectTrigger>
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
      </div>

      <Button type="submit" className="w-auto bg-blue-600 hover:bg-blue-700">
        Ajouter le Propriétaire
      </Button>
    </form>
  );
}
