"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddProprietaireFormComponent } from "@/components/add-proprietaire-form"

export default function AjouterProprietairePage() {
  return (
    <div className="min-h-screen bg-background">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <BreadCrumb />

        {/* Header Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border mb-6 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-card/20 rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Ajouter un Propriétaire</h1>
                  <p className="text-primary-foreground/80 text-sm">Créer un nouveau profil de propriétaire</p>
                </div>
              </div>
              <Link href="/proprietaires">
                <Button variant="outline" className="bg-card/10 border-white/20 text-white hover:bg-card/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-muted/40 px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Informations du Propriétaire</h2>
            <p className="text-sm text-muted-foreground">Veuillez remplir tous les champs obligatoires</p>
          </div>

          <AddProprietaireFormComponent />
        </div>
      </div>
    </div>
  )
}
