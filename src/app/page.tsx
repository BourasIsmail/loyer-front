"use client"

import { BreadCrumb } from "@/components/BreadCrumb"
import CardDashboard from "@/components/CardsDashboard"
import PieChart from "@/components/PieChart"
import SideBar from "@/components/SideBar"
import { LocalTableCard } from "@/components/LocalTableCard"
import { useQuery } from "react-query"
import {
  dashboard,
  locauxActif,
  locauxResilie,
  locauxSuspendu,
  downloadExcelLocalActif,
  downloadExcelLocalResilie,
  downloadExcelLocalSuspendu,
} from "./api/local"
import { BsFillPeopleFill } from "react-icons/bs"
import { FaWarehouse } from "react-icons/fa"

export default function Home() {
  const { data, isLoading, isError } = useQuery("dashboard", dashboard)

  return (
      <>
        <section>
          <SideBar />
          <div className="p-4 ml-64">
            <BreadCrumb />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
              <CardDashboard icon={<FaWarehouse />} title="Locaux" value={data?.totalLocaux} />
              {
                /*
                <CardDashboard
                    icon={<FaWarehouse />}
                    title="Locaux avec données incomplètes"
                    value={data?.locauxIncomplet}
                />
                <CardDashboard icon={<FaWarehouse />} title="Locaux avec données complètes" value={data?.localComplet} />
                */}

                <CardDashboard icon={<BsFillPeopleFill />} title="Propriétaires" value={data?.totalProprietaire} />
              {
                /*
                <CardDashboard
                    icon={<BsFillPeopleFill />}
                    title="Propriétaires avec données incomplètes"
                    value={data?.proprietaireIncomplet}
                />
                <CardDashboard
                    icon={<BsFillPeopleFill />}
                    title="Propriétaires avec données complètes"
                    value={data?.proprietaireComplet}
                />
                 */
              }
              </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-4">
              <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
                <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">Locaux par etat</h1>
                <PieChart
                    colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                    labels={["Actif", "Résilié", "Suspendu"]}
                    dataSet={[data?.localActif, data?.localResilie, data?.localSuspendue]}
                />
              </div>
              <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
                <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100">Proprietaire par type</h1>
                <PieChart
                    colors={["#FF6384", "#36A2EB"]}
                    labels={["Personne Physique", "Personne Morale"]}
                    dataSet={[data?.personnesPhysique, data?.personnesMorale]}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 mt-4">
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
        </section>
      </>
  )
}

