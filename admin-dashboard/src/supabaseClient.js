import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Real-time subscriptions
export const subscribeToOrders = (callback) => {
  return supabase
    .channel('orders_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, 
      callback
    )
    .subscribe()
}

export const subscribeToProducts = (callback) => {
  return supabase
    .channel('products_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' }, 
      callback
    )
    .subscribe()
}

export const subscribeToUsers = (callback) => {
  return supabase
    .channel('users_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'users' }, 
      callback
    )
    .subscribe()
}
