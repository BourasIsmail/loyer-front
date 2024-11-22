"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "react-query";
import { UserInfo } from "@/app/type/UserInfo";
import { api, getUser } from "@/app/api";
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

export default function Home({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<UserInfo>();
  const [open, setOpen] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUser(params.id),
    enabled: !!params.id,
    onSuccess: (data) => {
      setSelectedValue(data);
    },
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getAllProvinces(),
  });

  const updateUserMutation = useMutation(
    (data: UserInfo) => api.put(`/auth/updateUser/${data.id}`, data),
    {
      onSuccess: () => {
        toast({
          description: "Mis à jour des données a réussi",
          className: "bg-green-500 text-white",
          duration: 3000,
          title: "نجاح",
        });
        router.push("/comptes");
      },
      onError: () => {
        toast({
          description: "Mis à jour des données a échoué",
          variant: "destructive",
          duration: 3000,
          title: "خطأ",
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedValue) {
      updateUserMutation.mutate(selectedValue);
    }
  };

  const isSuperAdmin = user?.roles === "SUPER_ADMIN_ROLES";

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
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedValue?.email || ""}
                      onChange={(e) =>
                        setSelectedValue((prev) => ({
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
                      value={selectedValue?.name || ""}
                      onChange={(e) =>
                        setSelectedValue((prev) => ({
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
                        setSelectedValue((prev) => ({
                          ...prev!,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Mot de passe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select
                      value={selectedValue?.province?.id.toString()}
                      onValueChange={(value) =>
                        setSelectedValue((prev) => ({
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
                      value={selectedValue?.roles}
                      onValueChange={(value) =>
                        setSelectedValue((prev) => ({
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
                  <AlertDialog open={open} onOpenChange={setOpen}>
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
                        <AlertDialogAction onClick={handleSubmit}>
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
