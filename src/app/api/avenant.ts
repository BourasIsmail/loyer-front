import { getCookie } from "cookies-next";
import { api } from ".";
import { Avenant } from "../type/Avenant";

export async function getAvenants(): Promise<Avenant[]> {
  const token = getCookie("token");
  const data = await api.get("/Avenant", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

export async function getAv(id: number) {
  try {
    const token = getCookie("token");
    const response = await api.get(`/Avenant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Avenant;
  } catch (error) {
    console.log(error);
  }
}
