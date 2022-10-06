import axios from "axios";

const api = axios.create({
  baseURL: "https://ggl-iota.vercel.app/api",
});

export default api;
