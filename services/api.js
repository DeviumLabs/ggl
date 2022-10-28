import axios from "axios";

const api = axios.create({
  baseURL: "https://ggl-deviumlabs.vercel.app/api",
});

export default api;
