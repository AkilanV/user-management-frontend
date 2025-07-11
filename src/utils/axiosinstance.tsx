import axios from "axios";
import Cookies from "js-cookie";
import store from "../store/store"; 
import { startLoading, stopLoading } from "../store/feaures/loading/loaderSetUpSlice";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

// ✅ JSON instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    [API_KEY]: API_VALUE,
  },
});

// ✅ Multipart/form-data instance
const axiosformdataInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    [API_KEY]: API_VALUE,
  },
});

// ✅ Request interceptor
const attachTokenAndLoader = (config: any) => {
  store.dispatch(startLoading());

  const token = Cookies.get("_mbname");
  if (token) {
    // const accessToken = decryptToken(token); // if encrypted
    const accessToken = token; // plain token
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

// ✅ Response handler
const clearLoader = (response: any) => {
  store.dispatch(stopLoading());
  return response;
};

// ✅ Error handler
const handleError = (error: any) => {
  store.dispatch(stopLoading());
  return Promise.reject(error);
};

// Apply interceptors
axiosInstance.interceptors.request.use(attachTokenAndLoader, handleError);
axiosInstance.interceptors.response.use(clearLoader, handleError);

axiosformdataInstance.interceptors.request.use(attachTokenAndLoader, handleError);
axiosformdataInstance.interceptors.response.use(clearLoader, handleError);

export { axiosInstance, axiosformdataInstance };
