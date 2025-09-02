import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action, email, password, fullName } = req.body

  try {
    switch (action) {
      case 'signup':
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })

        if (signupError) throw signupError

        // Create user profile
        if (signupData.user) {
          await supabase.from('users').insert({
            id: signupData.user.id,
            email: signupData.user.email,
            full_name: fullName,
            role: 'customer'
          })
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Account created successfully! Please check your email for verification.',
          user: signupData.user 
        })

      case 'signin':
        const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signinError) throw signinError

        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', signinData.user.id)
          .single()

        return res.status(200).json({ 
          success: true, 
          message: 'Login successful!',
          user: { ...signinData.user, profile }
        })

      case 'signout':
        const { error: signoutError } = await supabase.auth.signOut()
        if (signoutError) throw signoutError

        return res.status(200).json({ 
          success: true, 
          message: 'Logged out successfully!' 
        })

      default:
        return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return res.status(400).json({ 
      error: error.message || 'Authentication failed' 
    })
  }
}


