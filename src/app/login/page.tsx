"use client";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { api } from "../api";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [email, setemail] = useState(""); // Provide initial value for email
  const [password, setpassword] = useState(""); // Provide initial value for password
  const { toast } = useToast();

  const login = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log(response.data);
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast({
        description: "Connexion réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
      window.location.href = "";
    } catch (error) {
      toast({
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
  };

  function handleSubmit(event: any) {
    event.preventDefault();
    login();
  }
  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div className="hidden bg-cover lg:block lg:w-2/3 bg-[url('/img1.png')] "></div>

          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                  Application Web de gestion des loyers
                </h2>

                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  Veuillez s'identifier
                </p>
              </div>

              <div className="mt-8">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-600 dark:text-gray-200">
                        Mot de passe
                      </label>
                    </div>

                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-pink-600 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      type="submit"
                    >
                      Se connecter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
