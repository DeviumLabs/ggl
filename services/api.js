import axios from "axios";

const api = axios.create({
  // baseURL: "https://ggl-deviumlabs.vercel.app/api",
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://ggl-test.vercel.app/api",
});

export default api;
