import { BreadCrumb } from "@/components/BreadCrumb";
import CardDashboard from "@/components/CardsDashboard";
import PieChart from "@/components/PieChart";
import PieChartBenef from "@/components/PieChart";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import { Pie } from "react-chartjs-2";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <section>
        <SideBar />
        <div className="p-4 ml-64 ">
          <BreadCrumb />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
            <CardDashboard
              icon={<FaWarehouse />}
              title="Locaux"
              value="55"
            ></CardDashboard>
            <CardDashboard
              icon={<BsFillPeopleFill />}
              title="Propriétaires"
              value="57"
            ></CardDashboard>
            <CardDashboard
              icon={<FaCheckSquare />}
              title="Payements engagés"
              value="14"
            ></CardDashboard>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-4">
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <PieChart
                colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                labels={["Cas 1 ", "Cas 2", "Cas 3"]}
                dataSet={[300, 50, 100]}
              />
            </div>
            <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-900">
              <PieChart
                colors={["#FF6384", "#36A2EB", "#FFCE56"]}
                labels={["Cas 1 ", "Cas 2", "Cas 3"]}
                dataSet={[40, 50, 90]}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
