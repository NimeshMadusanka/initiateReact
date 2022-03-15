import axios from "axios";

const baseUrl = process.env.REACT_APP_BE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
