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
        return await getCategories(req, res)
      case 'POST':
        return await createCategory(req, res)
      case 'PUT':
        return await updateCategory(req, res)
      case 'DELETE':
        return await deleteCategory(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getCategories(req, res) {
  try {
    const { active, parent_id } = req.query

    let query = supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .order('sort_order', { ascending: true })

    // Apply filters
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    if (parent_id) {
      query = query.eq('parent_category_id', parent_id)
    } else {
      query = query.is('parent_category_id', null) // Only top-level categories
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase Error:', error)
      return res.status(500).json({ error: error.message })
    }

    // Format the response
    const categoriesWithProductCount = data.map(category => ({
      ...category,
      product_count: category.products?.[0]?.count || 0
    }))

    return res.status(200).json({
      success: true,
      data: categoriesWithProductCount,
      count: categoriesWithProductCount.length
    })

  } catch (error) {
    console.error('Get Categories Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function createCategory(req, res) {
  try {
    const categoryData = req.body

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()

    if (error) {
      console.error('Create Category Error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({
      success: true,
      data: data[0],
      message: 'Category created successfully'
    })

  } catch (error) {
    console.error('Create Category Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.query
    const updateData = req.body

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Update Category Error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    return res.status(200).json({
      success: true,
      data: data[0],
      message: 'Category updated successfully'
    })

  } catch (error) {
    console.error('Update Category Error:', error)
    return res.status(500).json({ error: error.message })
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.query

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (productsError) {
      console.error('Check Products Error:', productsError)
      return res.status(500).json({ error: productsError.message })
    }

    if (products && products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing products' 
      })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete Category Error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Delete Category Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
