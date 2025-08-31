import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxrvemzqhoyfbsksrxzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cnZlbXpxaG95ZmJza3NyeHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTU3NDksImV4cCI6MjA3MjAzMTc0OX0.dVjXTsmLvmSWVzza7EQy06oKTfrGTzR9STFpjLN8ghQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: string;
  products: Product[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  created_at: string;
}

export interface DeliveryPartner {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  created_at: string;
}

