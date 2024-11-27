import { getCookie } from "cookies-next";
import { ComptePayement } from "../type/ComptePayement";
import { api } from ".";

export async function getComptes(): Promise<ComptePayement[]> {
  const token = getCookie("token");
  const data = await api.get("/Confirme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
