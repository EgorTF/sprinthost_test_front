import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_LARAVEL_API_ADDRESS,
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
