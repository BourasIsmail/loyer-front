"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Settings, Percent, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { getRasConfig } from "@/app/api/RasConfig"
import { api } from "@/app/api"
import { Skeleton } from "@/components/ui/skeleton"

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
})

type FormValues = z.infer<typeof formSchema>

export function RASConfigUpdateForm() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getRasConfig()
        if (config) {
          form.reset(config)
        }
      } catch (err) {
        setError("Failed to load RAS configuration. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [form])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const updatedConfig = await api.put(`/ras-config/${data.id}`, data)
      if (updatedConfig) {
        setSuccess(true)
        form.reset(updatedConfig.data)
      } else {
        throw new Error("Failed to update RAS configuration")
      }
    } catch (err) {
      setError("Failed to update RAS configuration. Please try again.")
      console.error("Error updating RAS configuration:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuration RAS</h2>
          <p className="text-gray-600 dark:text-gray-400">Modifier les paramètres de la Retenue à la Source</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                <CardTitle>Paramètres Principaux</CardTitle>
              </div>
              <CardDescription className="text-blue-100">
                Configuration des seuils et pourcentages de base
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="lowerThreshold1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Seuil inférieur 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Seuil supérieur 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Pourcentage 1
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Seuil inférieur 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Seuil supérieur 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Pourcentage 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Pourcentage 3
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <CardTitle>Cas Spéciaux</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => {
                    const newSpecialCases = {
                      ...form.getValues("specialCasePercentages"),
                    }
                    const newId = Date.now().toString()
                    newSpecialCases[newId] = 0
                    form.setValue("specialCasePercentages", newSpecialCases)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <CardDescription className="text-indigo-100">
                Pourcentages spécifiques pour certains locaux
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(form.watch("specialCasePercentages")).map(([localId, percentage]) => (
                  <div
                    key={localId}
                    className="flex items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID Local</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          value={localId}
                          onChange={(e) => {
                            const newSpecialCases = {
                              ...form.getValues("specialCasePercentages"),
                            }
                            delete newSpecialCases[localId]
                            newSpecialCases[e.target.value] = percentage
                            form.setValue("specialCasePercentages", newSpecialCases)
                          }}
                          placeholder="Entrez l'ID du local"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">Identifiant unique du local</FormDescription>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Pourcentage spécial
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          value={percentage}
                          onChange={(e) => {
                            const newPercentage = Number(e.target.value)
                            form.setValue("specialCasePercentages", {
                              ...form.getValues("specialCasePercentages"),
                              [localId]: newPercentage,
                            })
                          }}
                          placeholder="Entrez le pourcentage"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">Pourcentage RAS spécifique pour ce local</FormDescription>
                    </FormItem>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mb-1"
                      onClick={() => {
                        const newSpecialCases = {
                          ...form.getValues("specialCasePercentages"),
                        }
                        delete newSpecialCases[localId]
                        form.setValue("specialCasePercentages", newSpecialCases)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Object.keys(form.watch("specialCasePercentages")).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Plus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun cas spécial configuré</p>
                    <p className="text-sm">Cliquez sur "Ajouter" pour en créer un</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>La configuration RAS a été mise à jour avec succès.</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
              Mettre à jour la configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
