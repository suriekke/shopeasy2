import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  stock: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  items: any[]
  total_amount: number
  status: 'pending' | 'packed' | 'shipped' | 'delivered'
  shipping_address?: any
  created_at: string
  updated_at: string
}
