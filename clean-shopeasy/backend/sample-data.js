import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Sample categories
const sampleCategories = [
  {
    name: 'Fruits & Vegetables',
    description: 'Fresh fruits and vegetables',
    sort_order: 1
  },
  {
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, eggs and dairy products',
    sort_order: 2
  },
  {
    name: 'Bread & Bakery',
    description: 'Fresh bread and bakery items',
    sort_order: 3
  },
  {
    name: 'Beverages',
    description: 'Soft drinks, juices and beverages',
    sort_order: 4
  },
  {
    name: 'Snacks',
    description: 'Chips, biscuits and snacks',
    sort_order: 5
  },
  {
    name: 'Personal Care',
    description: 'Hygiene and personal care products',
    sort_order: 6
  },
  {
    name: 'Household',
    description: 'Cleaning and household items',
    sort_order: 7
  }
];

// Sample products
const sampleProducts = [
  // Fruits & Vegetables
  {
    name: 'Fresh Apples',
    description: 'Sweet and juicy red apples, perfect for snacking',
    price: 120.00,
    original_price: 150.00,
    discount_percentage: 20,
    stock_quantity: 50,
    unit: 'kg',
    brand: 'Fresh Farm',
    is_featured: true
  },
  {
    name: 'Organic Bananas',
    description: 'Organic yellow bananas, rich in potassium',
    price: 60.00,
    original_price: 80.00,
    discount_percentage: 25,
    stock_quantity: 100,
    unit: 'dozen',
    brand: 'Organic Valley',
    is_featured: false
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Ripe red tomatoes, perfect for cooking',
    price: 40.00,
    original_price: 50.00,
    discount_percentage: 20,
    stock_quantity: 75,
    unit: 'kg',
    brand: 'Fresh Farm',
    is_featured: false
  },
  {
    name: 'Onions',
    description: 'Fresh white onions, essential for cooking',
    price: 30.00,
    original_price: 35.00,
    discount_percentage: 14,
    stock_quantity: 200,
    unit: 'kg',
    brand: 'Fresh Farm',
    is_featured: false
  },

  // Dairy & Eggs
  {
    name: 'Organic Milk',
    description: 'Fresh organic milk, rich in calcium',
    price: 60.00,
    original_price: 70.00,
    discount_percentage: 14,
    stock_quantity: 100,
    unit: 'liter',
    brand: 'Organic Valley',
    is_featured: true
  },
  {
    name: 'Fresh Eggs',
    description: 'Farm fresh eggs, high in protein',
    price: 120.00,
    original_price: 140.00,
    discount_percentage: 14,
    stock_quantity: 150,
    unit: 'dozen',
    brand: 'Fresh Farm',
    is_featured: false
  },
  {
    name: 'Cheddar Cheese',
    description: 'Aged cheddar cheese, perfect for sandwiches',
    price: 180.00,
    original_price: 200.00,
    discount_percentage: 10,
    stock_quantity: 60,
    unit: 'pack',
    brand: 'Dairy Delight',
    is_featured: false
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein',
    price: 90.00,
    original_price: 110.00,
    discount_percentage: 18,
    stock_quantity: 80,
    unit: 'pack',
    brand: 'Yogurt Plus',
    is_featured: false
  },

  // Bread & Bakery
  {
    name: 'Whole Wheat Bread',
    description: 'Fresh whole wheat bread, healthy and nutritious',
    price: 35.00,
    original_price: 40.00,
    discount_percentage: 12,
    stock_quantity: 75,
    unit: 'pack',
    brand: 'Bakery Fresh',
    is_featured: true
  },
  {
    name: 'Croissants',
    description: 'Buttery croissants, perfect for breakfast',
    price: 45.00,
    original_price: 50.00,
    discount_percentage: 10,
    stock_quantity: 50,
    unit: 'pack',
    brand: 'Bakery Fresh',
    is_featured: false
  },
  {
    name: 'Chocolate Cake',
    description: 'Delicious chocolate cake, perfect for celebrations',
    price: 250.00,
    original_price: 300.00,
    discount_percentage: 17,
    stock_quantity: 20,
    unit: 'piece',
    brand: 'Sweet Treats',
    is_featured: false
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: 'Fresh orange juice, rich in vitamin C',
    price: 80.00,
    original_price: 100.00,
    discount_percentage: 20,
    stock_quantity: 60,
    unit: 'bottle',
    brand: 'Fresh Juices',
    is_featured: true
  },
  {
    name: 'Green Tea',
    description: 'Organic green tea, antioxidant rich',
    price: 120.00,
    original_price: 150.00,
    discount_percentage: 20,
    stock_quantity: 100,
    unit: 'pack',
    brand: 'Tea Time',
    is_featured: false
  },
  {
    name: 'Coffee Beans',
    description: 'Premium coffee beans, perfect for brewing',
    price: 200.00,
    original_price: 250.00,
    discount_percentage: 20,
    stock_quantity: 40,
    unit: 'pack',
    brand: 'Coffee Corner',
    is_featured: false
  },

  // Snacks
  {
    name: 'Potato Chips',
    description: 'Crispy potato chips, classic flavor',
    price: 20.00,
    original_price: 25.00,
    discount_percentage: 20,
    stock_quantity: 200,
    unit: 'pack',
    brand: 'Crunchy Snacks',
    is_featured: false
  },
  {
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts, healthy snacking',
    price: 150.00,
    original_price: 180.00,
    discount_percentage: 17,
    stock_quantity: 80,
    unit: 'pack',
    brand: 'Healthy Bites',
    is_featured: true
  },
  {
    name: 'Dark Chocolate',
    description: 'Rich dark chocolate, 70% cocoa',
    price: 100.00,
    original_price: 120.00,
    discount_percentage: 17,
    stock_quantity: 120,
    unit: 'bar',
    brand: 'Chocolate Delight',
    is_featured: false
  },

  // Personal Care
  {
    name: 'Organic Soap',
    description: 'Natural organic soap, gentle on skin',
    price: 80.00,
    original_price: 100.00,
    discount_percentage: 20,
    stock_quantity: 150,
    unit: 'pack',
    brand: 'Natural Care',
    is_featured: false
  },
  {
    name: 'Toothpaste',
    description: 'Fresh mint toothpaste, cavity protection',
    price: 60.00,
    original_price: 75.00,
    discount_percentage: 20,
    stock_quantity: 200,
    unit: 'tube',
    brand: 'Dental Care',
    is_featured: false
  },

  // Household
  {
    name: 'Dish Soap',
    description: 'Effective dish soap, cuts through grease',
    price: 45.00,
    original_price: 55.00,
    discount_percentage: 18,
    stock_quantity: 180,
    unit: 'bottle',
    brand: 'Clean Home',
    is_featured: false
  },
  {
    name: 'Laundry Detergent',
    description: 'Gentle laundry detergent, fresh scent',
    price: 120.00,
    original_price: 150.00,
    discount_percentage: 20,
    stock_quantity: 90,
    unit: 'bottle',
    brand: 'Clean Home',
    is_featured: false
  }
];

async function addSampleData() {
  try {
    console.log('🚀 Starting to add sample data...');

    // First, get existing categories to map them
    const categoriesResponse = await axios.get(`${API_BASE}/admin/categories`);
    const existingCategories = categoriesResponse.data.categories;
    
    // Create a map of category names to IDs
    const categoryMap = {};
    existingCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Add products with proper category IDs
    console.log('📦 Adding products...');
    for (const product of sampleProducts) {
      // Determine category based on product name/description
      let categoryId = null;
      
      if (product.name.includes('Apple') || product.name.includes('Banana') || 
          product.name.includes('Tomato') || product.name.includes('Onion')) {
        categoryId = categoryMap['Fruits & Vegetables'];
      } else if (product.name.includes('Milk') || product.name.includes('Egg') || 
                 product.name.includes('Cheese') || product.name.includes('Yogurt')) {
        categoryId = categoryMap['Dairy & Eggs'];
      } else if (product.name.includes('Bread') || product.name.includes('Croissant') || 
                 product.name.includes('Cake')) {
        categoryId = categoryMap['Bread & Bakery'];
      } else if (product.name.includes('Juice') || product.name.includes('Tea') || 
                 product.name.includes('Coffee')) {
        categoryId = categoryMap['Beverages'];
      } else if (product.name.includes('Chips') || product.name.includes('Nuts') || 
                 product.name.includes('Chocolate')) {
        categoryId = categoryMap['Snacks'];
      } else if (product.name.includes('Soap') || product.name.includes('Toothpaste')) {
        categoryId = categoryMap['Personal Care'];
      } else if (product.name.includes('Dish') || product.name.includes('Laundry')) {
        categoryId = categoryMap['Household'];
      }

      if (categoryId) {
        const productData = {
          ...product,
          category_id: categoryId,
          image_urls: [`https://via.placeholder.com/300x300/FF6B9D/FFFFFF?text=${encodeURIComponent(product.name)}`]
        };

        try {
          await axios.post(`${API_BASE}/admin/products`, productData);
          console.log(`✅ Added product: ${product.name}`);
        } catch (error) {
          console.error(`❌ Failed to add product ${product.name}:`, error.response?.data || error.message);
        }
      } else {
        console.warn(`⚠️ No category found for product: ${product.name}`);
      }
    }

    console.log('🎉 Sample data addition completed!');
    console.log(`📊 Added ${sampleProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error.response?.data || error.message);
  }
}

// Run the script
addSampleData();

