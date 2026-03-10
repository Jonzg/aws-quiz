import axios from 'axios'

// En desarrollo: VITE_API_URL está vacío → Vite hace proxy a localhost:8000
// En producción: VITE_API_URL = https://tu-backend.railway.app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export default api
