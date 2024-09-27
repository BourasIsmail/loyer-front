import { getCookie } from "cookies-next";
import { api } from ".";
import { Local } from "../type/Local";

export async function getLocaux(): Promise<Local[]> {
  const token = getCookie("token");
  const data = await api.get("/local/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

export async function getLocal(id: number) {
  try {
    const token = getCookie("token");
    const response = await api.get(`/local/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Local;
  } catch (error) {
    console.log(error);
  }
}

export async function getLocauxByCoordination(id: number) {
  try {
    const token = getCookie("token");
    const response = await api.get(`/local/getByRegion/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as Local;
  } catch (error) {
    console.log(error);
  }
}
