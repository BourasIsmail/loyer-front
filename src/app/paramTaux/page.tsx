import { BreadCrumb } from "@/components/BreadCrumb";
import { RASConfigUpdateForm } from "@/components/RASConfigUpdateForm";
import SideBar from "@/components/SideBar";

export default function Home() {
  return (
    <>
      <section>
        <SideBar />
        <div className="p-4 ml-64 ">
          <BreadCrumb />
          <div className="p-2 mt-5 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
            <RASConfigUpdateForm />
          </div>
        </div>
      </section>
    </>
  );
}
