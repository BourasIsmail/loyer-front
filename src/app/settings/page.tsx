"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "react-query";
import { UserInfo } from "@/app/type/UserInfo";
import { api } from "@/app/api";
import { getAllProvinces } from "@/app/api/province";
import { getCookie } from "cookies-next";
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

// Modified getCurrentUser to work directly with useQuery
async function getCurrentUser(): Promise<UserInfo> {
  const token = getCookie("token");
  if (!token) throw new Error("No token found");

  const payload = JSON.parse(atob(token.split(".")[1]));
  const email = payload.sub;

  const { data } = await api.get("/auth/email/" + email);
  return data;
}

export default function GestionCompte() {
  const router = useRouter();
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UserInfo | null>(null);
  const [dialogueOuvert, setDialogueOuvert] = useState(false);

  // Fetch current user
  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>(
    "utilisateur",
    getCurrentUser,
    {
      onSuccess: (data) => {
        // Initialize form with user data when loaded
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

  // Fetch provinces
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery(
    "provinces",
    getAllProvinces
  );

  const miseAJourUtilisateur = useMutation(
    (donnees: UserInfo) => api.put(`/auth/updateUser/${donnees.id}`, donnees),
    {
      onSuccess: () => {
        toast({
          description: "Les données ont été mises à jour avec succès",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "Succès",
        });
        router.push("/settings");
      },
      onError: () => {
        toast({
          description: "erreur lors de la mise à jour des données",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        });
      },
    }
  );

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    if (utilisateurSelectionne) {
      miseAJourUtilisateur.mutate(utilisateurSelectionne);
    }
  };

  const isSuperAdmin = utilisateur?.roles === "SUPER_ADMIN_ROLES";

  if (isLoadingUser || isLoadingProvinces) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <SideBar />
      <div className="p-4 ml-64">
        <BreadCrumb />
        <h1 className="text-2xl font-bold mb-4 py-2">Gestion des Comptes</h1>

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
                      value={utilisateurSelectionne?.email || ""}
                      onChange={(e) =>
                        setUtilisateurSelectionne((prev) => ({
                          ...prev!,
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
                      value={utilisateurSelectionne?.name || ""}
                      onChange={(e) =>
                        setUtilisateurSelectionne((prev) => ({
                          ...prev!,
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
                      onChange={(e) =>
                        setUtilisateurSelectionne((prev) => ({
                          ...prev!,
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
                      value={utilisateurSelectionne?.province?.id.toString()}
                      onValueChange={(value) =>
                        setUtilisateurSelectionne((prev) => ({
                          ...prev!,
                          province: provinces?.find(
                            (p) => p.id === Number(value)
                          ),
                        }))
                      }
                      disabled={!isSuperAdmin}
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
                      value={utilisateurSelectionne?.roles}
                      onValueChange={(value) =>
                        setUtilisateurSelectionne((prev) => ({
                          ...prev!,
                          roles: value,
                        }))
                      }
                      disabled={!isSuperAdmin}
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
                        <SelectItem value="SUPER_ADMIN_ROLES">
                          Compte administrateur
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
                        Confirmer la demande
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Êtes-vous absolument sûr ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action confirmera la demande.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={gererSoumission}>
                          Continuer
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
