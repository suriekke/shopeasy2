import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getProducts(req, res)
      case 'POST':
        return await createProduct(req, res)
      case 'PUT':
        return await updateProduct(req, res)
      case 'DELETE':
        return await deleteProduct(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getProducts(req, res) {
  try {
    const { 
      category_id, 
      featured, 
      bestseller, 
      new_arrival, 
      search, 
      min_price, 
      max_price,
      sort_by = 'created_at',
      sort_order = 'desc',
      limit = 50,
      offset = 0
    } = req.query

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name, icon),
        product_reviews(rating, review_text, created_at)
      `)

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (bestseller === 'true') {
      query = query.eq('is_bestseller', true)
    }
    if (new_arrival === 'true') {
      query = query.eq('is_new_arrival', true)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (min_price) {
      query = query.gte('price', parseFloat(min_price))
    }
    if (max_price) {
      query = query.lte('price', parseFloat(max_price))
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' })

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    const { data, error } = await query

    if (error) {
      console.error('Supabase Error:', error)
      return res.status(500).json({ error: error.message })
    }

    // Calculate average ratings
    const productsWithRatings = data.map(product => {
      const reviews = product.product_reviews || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      
      return {
        ...product,
        average_rating: Math.round(averageRating * 10) / 10,
        review_count: reviews.length
      }
    })

    return res.status(200).json({
      success: true,
      data: productsWithRatings,
      count: productsWithRatings.length
    })

  } catch (error) {
    console.error('Get Products Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function createProduct(req, res) {
  try {
    const productData = req.body

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()

    if (error) {
      console.error('Create Product Error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({
      success: true,
      data: data[0],
      message: 'Product created successfully'
    })

  } catch (error) {
    console.error('Create Product Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.query
    const updateData = req.body

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Update Product Error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json({
      success: true,
      data: data[0],
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Update Product Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.query

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete Product Error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete Product Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
