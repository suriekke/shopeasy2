# Admin Dashboard for Quick Commerce

A complete admin dashboard built with React, TailwindCSS, and Supabase for managing a quick commerce application.

## Features

- 🔐 **Secure Authentication** - Supabase Auth with role-based access
- 📊 **Dashboard Overview** - Real-time statistics and analytics
- 📦 **Product Management** - CRUD operations with CSV import/export
- 🛒 **Order Management** - Real-time order tracking and status updates
- 👥 **User Management** - User blocking/unblocking and admin privileges
- ⚙️ **Settings** - Dashboard configuration and preferences
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔄 **Real-time Updates** - Live data synchronization using Supabase subscriptions

## Tech Stack

- **Frontend**: React 18, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **CSV Processing**: PapaParse
- **Deployment**: Vercel/Firebase Hosting

## Quick Start

### 1. Clone and Install

```bash
cd admin-dashboard
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local` and fill in your credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Execute the SQL to create tables and policies

### 4. Create Admin User

1. Sign up through the admin dashboard login page
2. Go to Supabase SQL Editor and run:

```sql
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';
```

### 5. Run the Application

```bash
npm start
```

The admin dashboard will be available at `http://localhost:3000`

## Project Structure

```
admin-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.js          # Main layout with sidebar and navbar
│   ├── pages/
│   │   ├── LoginPage.js       # Authentication page
│   │   ├── Dashboard.js       # Overview with statistics
│   │   ├── Products.js        # Product management
│   │   ├── Orders.js          # Order tracking
│   │   ├── Users.js           # User management
│   │   ├── Settings.js        # Dashboard settings
│   │   └── NoAccess.js        # Access denied page
│   ├── supabaseClient.js      # Supabase configuration
│   ├── App.js                 # Main app with routing
│   ├── index.js               # React entry point
│   └── index.css              # TailwindCSS imports
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── supabase-schema.sql        # Database schema
├── env.example                # Environment variables template
└── README.md
```

## Database Schema

### Users Table
- `id` - UUID (references auth.users)
- `email` - TEXT (unique)
- `full_name` - TEXT
- `is_admin` - BOOLEAN (default: false)
- `is_active` - BOOLEAN (default: true)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Products Table
- `id` - UUID (primary key)
- `name` - TEXT (required)
- `description` - TEXT
- `price` - DECIMAL(10,2) (required)
- `category` - TEXT (required)
- `stock` - INTEGER (default: 0)
- `image_url` - TEXT
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Orders Table
- `id` - UUID (primary key)
- `user_id` - UUID (references users)
- `items` - JSONB (required)
- `total_amount` - DECIMAL(10,2) (required)
- `status` - TEXT (pending/packed/shipped/delivered)
- `shipping_address` - JSONB
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** - Only admins can access dashboard
- **Authentication required** for all admin operations
- **Secure API keys** stored in environment variables

## CSV Import/Export

### Import Format
Create a CSV file with these columns:
```csv
name,price,category,stock,image_url,description
"Product Name",29.99,"Electronics",100,"https://example.com/image.jpg","Product description"
```

### Export
Click "Export CSV" to download all products as a CSV file.

## Real-time Features

The dashboard uses Supabase real-time subscriptions for:
- Live order status updates
- Product inventory changes
- User management updates
- Instant data synchronization

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Build the project: `npm run build`
3. Initialize Firebase: `firebase init hosting`
4. Deploy: `firebase deploy`

## Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Endpoints

The dashboard uses Supabase client for all database operations:

- **Authentication**: `supabase.auth`
- **Products**: `supabase.from('products')`
- **Orders**: `supabase.from('orders')`
- **Users**: `supabase.from('users')`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.





