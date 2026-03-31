import { Resend } from 'resend';

// NOTE: You will need to add RESEND_API_KEY to your .env.local after signing up at resend.com
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmails(orderId: string, orderData: any) {
  const { customer, items, total } = orderData;
  const adminEmail = process.env.ADMIN_EMAIL || 'avinashcpsinha@gmail.com'; // Change this to your preferred admin email

  try {
    // 1. Send Email to the Customer
    await resend.emails.send({
      from: 'DuloraBite <orders@dulorabite.co.in>',
      to: customer.email,
      subject: `🍭 Order Confirmed - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #FF1493;">Thank you for your order!</h1>
          <p>Hi ${customer.full_name},</p>
          <p>Your sweetness journey has begun! We've received your order and we're getting it ready for you.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Order Details - #${orderId}</h3>
            <ul>
              ${items.map((item: any) => `<li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>`).join('')}
            </ul>
            <hr />
            <p><strong>Total Amount:</strong> ₹${total}</p>
          </div>
          
          <p><strong>Shipping to:</strong><br />
          ${customer.address}, ${customer.city}<br />
          Phone: ${customer.phone}</p>
          
          <p>We'll notify you once it's shipped! Stay sweet! 🍭✨</p>
        </div>
      `,
    });

    // 2. Send Email to the Admin (You)
    await resend.emails.send({
      from: 'DuloraBite System <system@dulorabite.co.in>',
      to: adminEmail,
      subject: `🚀 NEW ORDER RECEIVED - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #228B22;">📈 YOU HAVE A NEW ORDER!</h2>
          <p>A new purchase has just been made on DuloraBite.</p>
          
          <div style="background-color: #e6f7ff; padding: 15px; border-radius: 5px;">
            <h3>Customer: ${customer.full_name}</h3>
            <p>Email: ${customer.email} | Phone: ${customer.phone}</p>
            <p><strong>Revenue: ₹${total}</strong></p>
          </div>
          
          <h3>Items Purchased:</h3>
          <ul>${items.map((item: any) => `<li>${item.name} x${item.quantity}</li>`).join('')}</ul>
          
          <p><a href="https://dulorabite.co.in/admin" style="background-color: #FF1493; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a></p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
