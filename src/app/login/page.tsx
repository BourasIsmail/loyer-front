"use client"
import { setCookie } from "cookies-next"
import { useState } from "react"
import { api } from "../api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const login = async () => {
    setIsLoading(true)
    try {
      const response = await api.post("/auth/login", { email, password })
      console.log(response.data)
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
      toast({
        description: "Connexion réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      })
      window.location.href = ""
    } catch (error) {
      toast({
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: any) {
    event.preventDefault()
    login()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img1.png')] bg-cover bg-center opacity-35"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h1 className="text-4xl xl:text-5xl text-black font-bold mb-6">Gestion des Loyers</h1>
            <p className="text-xl xl:text-2xl text-black opacity-90 leading-relaxed">
              Simplifiez la gestion de vos propriétés locatives avec notre solution complète et intuitive.
            </p>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 xl:w-1/3 items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0">
              <CardHeader className="space-y-4 pb-8">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Connexion</CardTitle>
                  <CardDescription className="text-base mt-2">Accédez à votre espace de gestion</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Adresse email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@domaine.com"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
