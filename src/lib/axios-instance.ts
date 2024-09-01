'use client'

import axios from "axios";
import { getTokenFromLocalStorage } from "./utils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  timeout: 1000,
});

axiosInstance.interceptors.request.use(async function (config) {
  const token = getTokenFromLocalStorage();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  console.log(`[${config.url}] >>`)
  return config;
});

axiosInstance.interceptors.response.use(function (response) {

  return response.data
});
export default axiosInstance;