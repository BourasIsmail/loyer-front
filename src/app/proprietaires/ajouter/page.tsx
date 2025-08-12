"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import SideBar from "@/components/SideBar"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddProprietaireFormComponent } from "@/components/add-proprietaire-form"

export default function AjouterProprietairePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 sm:ml-64">
        <BreadCrumb />

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Ajouter un Propriétaire</h1>
                  <p className="text-blue-100 text-sm">Créer un nouveau profil de propriétaire</p>
                </div>
              </div>
              <Link href="/proprietaires">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Informations du Propriétaire</h2>
            <p className="text-sm text-gray-600">Veuillez remplir tous les champs obligatoires</p>
          </div>

          <AddProprietaireFormComponent />
        </div>
      </div>
    </div>
  )
}
