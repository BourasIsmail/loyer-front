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

export async function dashboard() {
  try {
    const token = getCookie("token");
    const response = await api.get(`/local/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function locauxActif(){
  try{
    const token = getCookie("token");
    const response = await api.get(`/local/etat/actif`,{
      headers:{
        Authorization: `Bearer ${token}`
      },
    })
    return response.data;
  }catch (error) {
    console.log(error);
  }
}

export async function locauxResilie(){
  try{
    const token = getCookie("token");
    const response = await api.get(`/local/etat/resilie`,{
      headers:{
        Authorization: `Bearer ${token}`
      },
    })
    return response.data;
  }catch (error) {
    console.log(error);
  }
}

export async function locauxSuspendu(){
  try{
    const token = getCookie("token");
    const response = await api.get(`/local/etat/suspendu`,{
      headers:{
        Authorization: `Bearer ${token}`
      },
    })
    return response.data;
  }catch (error) {
    console.log(error);
  }
}

export async function downloadExcelLocalActif() {
  try {
    const token = getCookie("token")
    const response = await api.get("/local/excel/localActif", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downloadExcelLocalResilie() {
  try {
    const token = getCookie("token")
    const response = await api.get("/local/excel/localResilie", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downloadExcelLocalSuspendu() {
  try {
    const token = getCookie("token")
    const response = await api.get("/local/excel/localSuspendu", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}