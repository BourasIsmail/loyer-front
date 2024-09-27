import { api } from ".";
import { Province } from "../type/Province";

export async function getProvinces(page: number = 0): Promise<Province[]> {
  try {
    const response = await api.get(`/province?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getProvince(id: number): Promise<Province> {
  try {
    const response = await api.get(`/province/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllProvinces(): Promise<Province[]> {
  try {
    const response = await api.get(`/province/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getProvinceByRegion(id: number): Promise<Province[]> {
  try {
    const response = await api.get(`/province/region/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
