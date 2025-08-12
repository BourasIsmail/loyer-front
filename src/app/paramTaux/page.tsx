import { BreadCrumb } from "@/components/BreadCrumb"
import { RASConfigUpdateForm } from "@/components/RASConfigUpdateForm"
import SideBar from "@/components/SideBar"

export default function ParamTauxPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <SideBar />

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <BreadCrumb />

          {/* Page Header */}
          <div className="mt-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <h1 className="text-2xl font-bold mb-2">Paramétrage du Taux RAS</h1>
              <p className="text-blue-100 text-sm">
                Configuration des seuils et pourcentages de la Retenue à la Source
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <RASConfigUpdateForm />
          </div>
        </div>
      </div>
    </div>
  )
}
