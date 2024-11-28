"use client";

import { api, getCurrentUsers, logout } from "@/app/api";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoReceiptSharp } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import { UserInfo } from "@/app/type/UserInfo";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";
import { toast } from "@/hooks/use-toast";
import { MdOutlineNotificationAdd } from "react-icons/md";

const SideBar = () => {
  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UserInfo | null>(null);
  // Fetch current user
  const { data: utilisateur, isLoading: isLoadingUser } = useQuery<UserInfo>(
    "utilisateur",
    getCurrentUsers,
    {
      onSuccess: (data) => {
        // Initialize form with user data when loaded
        setUtilisateurSelectionne(data);
      },
      onError: (error) => {
        toast({
          description: "Erreur lors de la récupération des données utilisateur",
          variant: "destructive",
          duration: 3000,
          title: "Erreur",
        });
      },
    }
  );
  return (
    <>
      <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r bg-cover  lg:block  bg-[url('/side.png')]">
        <div className="flex items-center justify-center h-14 border-b">
          <div>
            <p className="text-xl">
              <Image src={"/logo.png"} alt={""} width={150} height={100} />
            </p>
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Menu
                </div>
              </div>
            </li>
            <li>
              <a
                href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <AiOutlineDashboard />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Dashboard
                </span>
              </a>
            </li>
            <li>
              <a
                href="/locaux"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Locaux
                </span>
              </a>
            </li>
            <li>
              <a
                href="/locaux/ov"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <IoReceiptSharp />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Ordre de virement
                </span>
              </a>
            </li>
            <li>
              <a
                href="/proprietaires"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FaPeopleRoof />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Proprietaires
                </span>
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Settings
                </span>
              </a>
            </li>
            {utilisateur?.roles === "SUPER_ADMIN_ROLES" && (
              <li>
                <a
                  href="/accounts"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaUserAlt />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Gestions des Comptes
                  </span>
                </a>
              </li>
            )}
            <li>
              <a
                href="/avenant"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <MdOutlineNotificationAdd />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Avenants
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={logout}
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 hover:cursor-pointer"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Logout
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
