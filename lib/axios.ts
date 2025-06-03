import baseAxios from "axios";

const axios = baseAxios.create({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin + '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;