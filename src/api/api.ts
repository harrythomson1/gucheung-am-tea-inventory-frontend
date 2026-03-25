import axios from 'axios'
import { supabase } from '../lib/supabase'

const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) throw new Error('VITE_API_URL is not set')

const api = axios.create({
  baseURL: apiUrl,
})

api.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch (error) {
    console.error('Failed to get session:', error)
  }
  return config
})

export default api
