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
          // Get single product
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()
          
          if (error) throw error
          return res.status(200).json(data)
        } else {
          // Get all products
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          return res.status(200).json(data)
        }

      case 'POST':
        const { name, description, price, stock, category, image_url, sku } = req.body
        
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            image_url,
            sku
          })
          .select()
          .single()
        
        if (createError) throw createError
        return res.status(201).json(newProduct)

      case 'PUT':
        const { id: updateId, ...updates } = req.body
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', updateId)
          .select()
          .single()
        
        if (updateError) throw updateError
        return res.status(200).json(updatedProduct)

      case 'DELETE':
        const { id: deleteId } = req.query
        
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', deleteId)
        
        if (deleteError) throw deleteError
        return res.status(200).json({ message: 'Product deleted successfully' })

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}
