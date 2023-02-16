import axios from "axios";

const api = axios.create({
  // baseURL: "https://ggl-deviumlabs.vercel.app/api",
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "https://ggl-deviumlabs.vercel.app/api",
});

export default api;
