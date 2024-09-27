import { api } from ".";
import { Region } from "../type/Region";

export async function getRegions(page: number = 0): Promise<Region[]> {
  try {
    const response = await api.get(`/region?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getRegion(id: number): Promise<Region> {
  try {
    const response = await api.get(`/region/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getALLRegions(): Promise<Region[]> {
  try {
    const response = await api.get(`/region/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
