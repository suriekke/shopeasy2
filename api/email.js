import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SMTP_HOST,
  port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    to, 
    subject, 
    template, 
    data = {} 
  } = req.body

  try {
    let html = ''

    // Email templates
    switch (template) {
      case 'order_confirmation':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Confirmation</h2>
            <p>Dear ${data.customer_name},</p>
            <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> #${data.order_id}</p>
              <p><strong>Total:</strong> $${data.total}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            </div>
            
            <p>We'll send you another email when your order ships.</p>
            <p>Best regards,<br>ShopEasy Team</p>
          </div>
        `
        break

      case 'order_shipped':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your Order Has Shipped!</h2>
            <p>Dear ${data.customer_name},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Shipping Details:</h3>
              <p><strong>Order ID:</strong> #${data.order_id}</p>
              <p><strong>Tracking Number:</strong> ${data.tracking_number}</p>
              <p><strong>Estimated Delivery:</strong> ${data.estimated_delivery}</p>
            </div>
            
            <p>Track your package: <a href="${data.tracking_url}">Click here</a></p>
            <p>Best regards,<br>ShopEasy Team</p>
          </div>
        `
        break

      case 'password_reset':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Dear ${data.customer_name},</p>
            <p>We received a request to reset your password. Click the link below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.reset_url}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>ShopEasy Team</p>
          </div>
        `
        break

      case 'welcome':
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to ShopEasy!</h2>
            <p>Dear ${data.customer_name},</p>
            <p>Welcome to ShopEasy! We're excited to have you as part of our community.</p>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Get Started:</h3>
              <ul>
                <li>Browse our products</li>
                <li>Create your first order</li>
                <li>Save items to your wishlist</li>
                <li>Write reviews for products you love</li>
              </ul>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>ShopEasy Team</p>
          </div>
        `
        break

      default:
        return res.status(400).json({ error: 'Invalid email template' })
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@shopeasy.com',
      to,
      subject,
      html
    }

    await transporter.sendMail(mailOptions)

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    })

  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to send email' 
    })
  }
}
