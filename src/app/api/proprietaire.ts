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

export const generateConfirmedPaymentsReport = async (
  proprietaireId: number,
  year: number
): Promise<Blob> => {
  const response = await api.get(
    `/Proprietaire/confirmedPaymentsReport/${proprietaireId}/${year}`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};


export async function getProprietaireByRegion(id: number | null) {
  try {
    const token = getCookie("token")
    if (id === null) {
      return getProprietaires()
    }
    const response = await api.get(`/Proprietaire/byRegion/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data as Proprietaire[]
  } catch (error) {
    console.log(error)
    return []
  }
}
