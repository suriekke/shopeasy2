import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fgdscohjkkpluhtlruau.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZHNjb2hqa2twbHVodGxydWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI1MzEsImV4cCI6MjA3MjMxODUzMX0.P59uwU00Tu7WIMC85k8uoURIysBZI55g8HN9hwtK3jU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  stock_quantity: number
  category_id: string
  image_url: string
  unit: string
  discount_percentage: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email?: string
  phone?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  total_amount: number
  delivery_fee: number
  handling_fee: number
  final_amount: number
  delivery_address_id: string
  payment_method: 'cod' | 'upi' | 'card' | 'wallet'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  estimated_delivery_time?: string
  actual_delivery_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  total_price: number
  created_at: string
}

