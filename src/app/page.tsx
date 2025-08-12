"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import CardDashboard from "@/components/CardsDashboard"
import PieChart from "@/components/PieChart"
import SideBar from "@/components/SideBar"
import { LocalTableCard } from "@/components/LocalTableCard"
import { useQuery } from "react-query"
import { dashboard, locauxResilie, locauxSuspendu, downloadExcelLocalResilie, downloadExcelLocalSuspendu } from "./api/local"
import { BsFillPeopleFill } from "react-icons/bs"
import { FaWarehouse } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const { data, isLoading, isError } = useQuery("dashboard", dashboard)

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SideBar />
        <div className="p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <Alert className="max-w-2xl mx-auto mt-20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Une erreur est survenue lors du chargement des données. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SideBar />
      <div className="p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
            {isLoading ? (
              <>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </>
            ) : (
              <>
                <CardDashboard icon={<FaWarehouse className="h-6 w-6" />} title="Locaux" value={data?.totalLocaux} />
                <CardDashboard
                  icon={<BsFillPeopleFill className="h-6 w-6" />}
                  title="Propriétaires"
                  value={data?.totalProprietaire}
                />
              </>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Locaux par état</h2>
                <p className="text-sm text-gray-600 mt-1">Répartition de vos biens locatifs</p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Skeleton className="h-48 w-48 rounded-full" />
                  </div>
                ) : (
                  <PieChart
                    colors={["#10B981", "#EF4444", "#F59E0B"]}
                    labels={["Actif", "Résilié", "Suspendu"]}
                    dataSet={[data?.localActif, data?.localResilie, data?.localSuspendue]}
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Propriétaires par type</h2>
                <p className="text-sm text-gray-600 mt-1">Classification de vos propriétaires</p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Skeleton className="h-48 w-48 rounded-full" />
                  </div>
                ) : (
                  <PieChart
                    colors={["#3B82F6", "#8B5CF6"]}
                    labels={["Personne Physique", "Personne Morale"]}
                    dataSet={[data?.personnesPhysique, data?.personnesMorale]}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="space-y-8 mt-8">
            <LocalTableCard
              title="Locaux Suspendus"
              queryKey="locauxSuspendu"
              queryFn={locauxSuspendu}
              downloadFn={downloadExcelLocalSuspendu}
            />
            <LocalTableCard
              title="Locaux Résiliés"
              queryKey="locauxResilie"
              queryFn={locauxResilie}
              downloadFn={downloadExcelLocalResilie}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
