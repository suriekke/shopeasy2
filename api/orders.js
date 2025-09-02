import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const { id } = req.query
        
        if (id) {
          // Get single order with items
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()
          
          if (orderError) throw orderError

          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', id)
          
          if (itemsError) throw itemsError

          return res.status(200).json({ ...order, items })
        } else {
          // Get all orders
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          return res.status(200).json(data)
        }

      case 'POST':
        const { 
          user_id, 
          customer_name, 
          customer_email, 
          customer_phone,
          total, 
          subtotal,
          tax,
          shipping_cost,
          shipping_address,
          billing_address,
          items 
        } = req.body
        
        // Create order
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id,
            customer_name,
            customer_email,
            customer_phone,
            total: parseFloat(total),
            subtotal: parseFloat(subtotal),
            tax: parseFloat(tax || 0),
            shipping_cost: parseFloat(shipping_cost || 0),
            shipping_address,
            billing_address,
            status: 'pending',
            payment_status: 'pending'
          })
          .select()
          .single()
        
        if (orderError) throw orderError

        // Create order items
        if (items && items.length > 0) {
          const orderItems = items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            total: parseFloat(item.total)
          }))

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
          
          if (itemsError) throw itemsError
        }

        return res.status(201).json(newOrder)

      case 'PUT':
        const { id: updateId, ...updates } = req.body
        
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', updateId)
          .select()
          .single()
        
        if (updateError) throw updateError
        return res.status(200).json(updatedOrder)

      case 'DELETE':
        const { id: deleteId } = req.query
        
        // Delete order items first
        await supabase
          .from('order_items')
          .delete()
          .eq('order_id', deleteId)
        
        // Delete order
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('id', deleteId)
        
        if (deleteError) throw deleteError
        return res.status(200).json({ message: 'Order deleted successfully' })

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Orders API error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}



