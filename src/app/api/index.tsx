import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { UserInfo } from "../type/UserInfo";

const client = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log("error 401");
    }
    if (error.response.status === 403) {
      console.log("error 403");
      deleteCookie("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
client.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const api = client;

export function getStagiaires() {
  return async () => {
    // TODO checks and params to all custom hooks

    const token = getCookie("token");
    console.log(token);
    const { data } = await api.get("/stagiaire/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
}

export function getUsers() {
  return async () => {
    const token = getCookie("token");
    const { data } = await api.get("/auth/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
}
const tokenPayload = async () => {
  const token = await getCookie("token");
  if (!token) return null;
  const payload = token?.split(".")[1];
  const decodedPayload = await atob(payload);
  const tokenPay = JSON.parse(decodedPayload);
  return tokenPay?.sub;
};
export function getCurrentUser() {
  return async () => {
    const email = await tokenPayload();
    if (!email) return null;
    const token = getCookie("token");
    const { data } = await api.get("/auth/email/" + email, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
}

export const logout = async () => {
  deleteCookie("token"); // Delete token cookie
  // Additional logic for clearing user data, redirecting, etc.
  window.location.href = "/login";
};

export async function getUser(id: number) {
  try {
    const response = await api.get(`/auth/getUser/${id}`);
    return response.data as UserInfo;
  } catch (error) {
    console.log(error);
  }
}
