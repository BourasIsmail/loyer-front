import { getCookie } from "cookies-next";
import { api } from ".";
import { Proprietaire } from "../type/Proprietaire";

export async function getProprietaires(): Promise<Proprietaire[]> {
  const token = getCookie("token");
  const data = await api.get("/Proprietaire/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

export async function getProprietaire(id: number) {
  try {
    const token = getCookie("token");
    const response = await api.get(`/Proprietaire/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Proprietaire;
  } catch (error) {
    console.log(error);
  }
}
