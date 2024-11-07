"use client";
import { getLocal } from "@/app/api/local";
import { getProprietaire, getProprietaires } from "@/app/api/proprietaire";
import { getAllProvinces } from "@/app/api/province";
import { Local } from "@/app/type/Local";
import { Proprietaire } from "@/app/type/Proprietaire";
import { BreadCrumb } from "@/components/BreadCrumb";
import SideBar from "@/components/SideBar";
import Select from "react-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useQuery } from "react-query";
import { AddProprietaireFormComponent } from "@/components/add-proprietaire-form";

export default function Home() {
  return (
    <>
      <section>
        <SideBar />
        <div className="p-4 ml-64 ">
          <BreadCrumb />
          <div className="p-2 mt-5 border-2 bg-white border-gray-200 rounded-lg dark:border-gray-700">
            <section className="bg-white dark:bg-gray-900">
              <div className=" px-4 py-2 mx-auto lg:py-2">
                <AddProprietaireFormComponent />
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
