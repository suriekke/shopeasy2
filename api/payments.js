import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const stripe = new Stripe(stripeSecretKey)

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'POST':
        const { 
          order_id, 
          amount, 
          currency = 'usd', 
          payment_method,
          customer_email,
          customer_name 
        } = req.body

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata: {
            order_id: order_id.toString(),
            customer_email,
            customer_name
          }
        })

        // Save payment record to database
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id,
            amount: parseFloat(amount),
            currency: currency.toUpperCase(),
            status: 'pending',
            payment_method: payment_method || 'stripe',
            payment_intent_id: paymentIntent.id
          })
          .select()
          .single()

        if (paymentError) throw paymentError

        return res.status(200).json({
          client_secret: paymentIntent.client_secret,
          payment_id: payment.id,
          payment_intent_id: paymentIntent.id
        })

      case 'PUT':
        const { payment_intent_id, status } = req.body

        // Update payment status
        const { data: updatedPayment, error: updateError } = await supabase
          .from('payments')
          .update({ status })
          .eq('payment_intent_id', payment_intent_id)
          .select()
          .single()

        if (updateError) throw updateError

        // Update order payment status
        if (updatedPayment) {
          await supabase
            .from('orders')
            .update({ payment_status: status })
            .eq('id', updatedPayment.order_id)
        }

        return res.status(200).json(updatedPayment)

      case 'GET':
        const { id } = req.query

        if (id) {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single()

          if (error) throw error
          return res.status(200).json(data)
        } else {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) throw error
          return res.status(200).json(data)
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Payments API error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}




