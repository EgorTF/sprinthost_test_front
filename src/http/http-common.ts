import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://a0754686.xsph.ru/laravel/public/api/",
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
