import { getCookie } from "cookies-next";
import { api } from ".";
import { Paiement } from "../type/Paiement";

export async function getFactureById(id: number) {
  try {
    const token = getCookie("token");
    const response = await api.get(`/Paiement/byId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Paiement;
  } catch (error) {
    console.log(error);
  }
}

export async function getFactureByLocal(id: number): Promise<Paiement[]> {
  const token = getCookie("token");
  const data = await api.get(`/Paiement/byLocal/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
