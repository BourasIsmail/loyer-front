"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getRasConfig } from "@/app/api/RasConfig";
import { api } from "@/app/api";

const formSchema = z.object({
  id: z.number(),
  lowerThreshold1: z.number().min(0),
  upperThreshold1: z.number().min(0),
  percentage1: z.number().min(0).max(100),
  lowerThreshold2: z.number().min(0),
  upperThreshold2: z.number().min(0),
  percentage2: z.number().min(0).max(100),
  percentage3: z.number().min(0).max(100),
  specialCasePercentages: z.record(z.string(), z.number().min(0).max(100)),
});

type FormValues = z.infer<typeof formSchema>;

export function RASConfigUpdateForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      lowerThreshold1: 0,
      upperThreshold1: 0,
      percentage1: 0,
      lowerThreshold2: 0,
      upperThreshold2: 0,
      percentage2: 0,
      percentage3: 0,
      specialCasePercentages: {},
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getRasConfig();
        if (config) {
          form.reset(config);
        }
      } catch (err) {
        setError("Failed to load RAS configuration. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedConfig = await api.put(`/ras-config/${data.id}`, data);
      if (updatedConfig) {
        setSuccess(true);
        form.reset(updatedConfig.data);
      } else {
        throw new Error("Failed to update RAS configuration");
      }
    } catch (err) {
      setError("Failed to update RAS configuration. Please try again.");
      console.error("Error updating RAS configuration:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mise à jour de la configuration RAS</CardTitle>
        <CardDescription>
          Modifier les paramètres de la Retenue à la Source (RAS)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lowerThreshold1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil inférieur 1</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upperThreshold1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil supérieur 1</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage 1</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowerThreshold2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil inférieur 2</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upperThreshold2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil supérieur 2</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage 2</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage 3</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Pourcentages pour cas spéciaux
              </h3>
              {Object.entries(form.watch("specialCasePercentages")).map(
                ([localId, percentage]) => (
                  <div
                    key={localId}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <FormItem className="flex-1">
                      <FormLabel>ID Local</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={localId}
                          onChange={(e) => {
                            const newSpecialCases = {
                              ...form.getValues("specialCasePercentages"),
                            };
                            delete newSpecialCases[localId];
                            newSpecialCases[e.target.value] = percentage;
                            form.setValue(
                              "specialCasePercentages",
                              newSpecialCases
                            );
                          }}
                          placeholder="Entrez l'ID du local"
                        />
                      </FormControl>
                      <FormDescription>
                        Identifiant unique du local
                      </FormDescription>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormLabel>Pourcentage spécial</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={percentage}
                          onChange={(e) => {
                            const newPercentage = Number(e.target.value);
                            form.setValue("specialCasePercentages", {
                              ...form.getValues("specialCasePercentages"),
                              [localId]: newPercentage,
                            });
                          }}
                          placeholder="Entrez le pourcentage"
                        />
                      </FormControl>
                      <FormDescription>
                        Pourcentage RAS spécifique pour ce local
                      </FormDescription>
                    </FormItem>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const newSpecialCases = {
                          ...form.getValues("specialCasePercentages"),
                        };
                        delete newSpecialCases[localId];
                        form.setValue(
                          "specialCasePercentages",
                          newSpecialCases
                        );
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                onClick={() => {
                  const newSpecialCases = {
                    ...form.getValues("specialCasePercentages"),
                  };
                  const newId = Date.now().toString();
                  newSpecialCases[newId] = 0;
                  form.setValue("specialCasePercentages", newSpecialCases);
                }}
              >
                Ajouter un cas spécial
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertTitle>Succès</AlertTitle>
                <AlertDescription>
                  La configuration RAS a été mise à jour avec succès.
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Mettre à jour la configuration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
