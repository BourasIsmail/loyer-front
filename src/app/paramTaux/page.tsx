import { BreadCrumb } from "@/components/BreadCrumb"
import { RASConfigUpdateForm } from "@/components/RASConfigUpdateForm"
import SideBar from "@/components/SideBar"

export default function ParamTauxPage() {
  return (
    <div className="min-h-screen bg-background">
      <SideBar />

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <BreadCrumb />

          {/* Page Header */}
          <div className="mt-6 mb-8">
            <div className="bg-primary rounded-xl p-6 text-white shadow-sm">
              <h1 className="text-2xl font-bold mb-2">Paramétrage du Taux RAS</h1>
              <p className="text-primary-foreground/80 text-sm">
                Configuration des seuils et pourcentages de la Retenue à la Source
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
            <RASConfigUpdateForm />
          </div>
        </div>
      </div>
    </div>
  )
}
