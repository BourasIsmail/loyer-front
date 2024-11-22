"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "react-query";
import { UserInfo } from "@/app/type/UserInfo";
import { api } from "@/app/api";
import { getAllProvinces } from "@/app/api/province";
import SideBar from "@/components/SideBar";
import { BreadCrumb } from "@/components/BreadCrumb";
import { toast } from "@/hooks/use-toast";
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

export default function AjouterCompte() {
  const router = useRouter();
  const [nouveauCompte, setNouveauCompte] = useState<Partial<UserInfo>>({});
  const [dialogueOuvert, setDialogueOuvert] = useState(false);

  // Fetch provinces
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery(
    "provinces",
    getAllProvinces
  );

  const ajouterUtilisateur = useMutation(
    (donnees: Partial<UserInfo>) => api.post("/auth/addUser", donnees),
    {
      onSuccess: () => {
        toast({
          description: "Le compte a été créé avec succès",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
        router.push("/addComptes");
      },
      onError: () => {
        toast({
          description: "Erreur lors de la création du compte",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        });
      },
    }
  );

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    if (nouveauCompte) {
      ajouterUtilisateur.mutate(nouveauCompte);
    }
  };

  if (isLoadingProvinces) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <h1 className="text-2xl font-bold mb-4 py-2">Ajouter un Compte</h1>

        <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700">
          <section className="bg-white dark:bg-gray-900">
            <div className="px-4 py-2 mx-auto lg:py-2">
              <form onSubmit={gererSoumission}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={nouveauCompte.email || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Adresse e-mail"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      type="text"
                      value={nouveauCompte.name || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={nouveauCompte.password || ""}
                      onChange={(e) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Mot de passe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select
                      onValueChange={(value) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          province: provinces?.find(
                            (p) => p.id === Number(value)
                          ),
                        }))
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
                    <Label htmlFor="roles">Type de compte</Label>
                    <Select
                      onValueChange={(value) =>
                        setNouveauCompte((prev) => ({
                          ...prev,
                          roles: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de compte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER_ROLES">
                          Compte utilisateur de service de droit juridique
                        </SelectItem>
                        <SelectItem value="ADMIN_ROLES">
                          Compte utilisateur service budget
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-start items-end gap-3">
                  <AlertDialog
                    open={dialogueOuvert}
                    onOpenChange={setDialogueOuvert}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                      >
                        Créer le compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Êtes-vous sûr de vouloir créer ce compte ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action créera un nouveau compte utilisateur.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={gererSoumission}>
                          Créer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
