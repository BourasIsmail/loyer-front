import { getCookie } from "cookies-next";
import { api } from ".";
import { RASConfig } from "../type/RASConfig";

export async function getRasConfig() {
  try {
    const token = getCookie("token");
    const response = await api.get(`/ras-config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as RASConfig;
  } catch (error) {
    console.log(error);
  }
}
