const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.warn('Email service not configured. Emails will not be sent.');
  transporter = null;
}

const sendOrderConfirmation = async (email, order, orderLink) => {
  if (!transporter) {
    console.warn('Email service not configured');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmed - ${process.env.STORE_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Order Confirmed! 🎉</h2>
          
          <p>Thank you for your purchase at <strong>${process.env.STORE_NAME}</strong>!</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> Rp ${order.total_amount.toLocaleString('id-ID')}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.payment_method.replace('_', ' ').toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>
          </div>

          <p style="line-height: 1.6;">
            Please complete your payment to process your order. Once payment is verified, your items will be delivered immediately.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${orderLink}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order & Payment
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <div style="font-size: 12px; color: #6b7280;">
            <p>Thank you for choosing ${process.env.STORE_NAME}!</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} ${process.env.STORE_NAME}. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error.message);
    return false;
  }
};

const sendPaymentVerification = async (email, order) => {
  if (!transporter) {
    console.warn('Email service not configured');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Payment Received - ${process.env.STORE_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Payment Received! ✅</h2>
          
          <p>We've received your payment for order <strong>${order.id}</strong>.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #16a34a;">Payment Confirmation</h3>
            <p style="margin: 5px 0;"><strong>Amount Received:</strong> Rp ${order.total_amount.toLocaleString('id-ID')}</p>
            <p style="margin: 5px 0;"><strong>Order Status:</strong> Processing</p>
            <p style="margin: 5px 0;"><strong>Received At:</strong> ${new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}</p>
          </div>

          <p style="line-height: 1.6;">
            Your payment is being verified by our team. Your game items will be delivered as soon as the verification is complete, usually within a few minutes.
          </p>

          <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
            <strong style="color: #b45309;">⏳ Expected Delivery:</strong> Within 1-5 minutes after verification
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <div style="font-size: 12px; color: #6b7280;">
            <p>Thank you for your purchase!</p>
            <p>© ${new Date().getFullYear()} ${process.env.STORE_NAME}. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Payment verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send payment verification email:', error.message);
    return false;
  }
};

const sendOrderCompletion = async (email, order) => {
  if (!transporter) {
    console.warn('Email service not configured');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Completed - ${process.env.STORE_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Order Completed! 🎮</h2>
          
          <p>Great news! Your order <strong>${order.id}</strong> has been completed successfully!</p>
          
          <div style="background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #7c3aed;">Order Summary</h3>
            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> Rp ${order.total_amount.toLocaleString('id-ID')}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ✅ COMPLETED</p>
            <p style="margin: 5px 0;"><strong>Completed At:</strong> ${new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}</p>
          </div>

          <p style="line-height: 1.6;">
            Your game items have been delivered to your account. Please check your game inbox and account to verify that you've received all items.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.STORE_URL}/orders/${order.id}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order Details
            </a>
          </div>

          <div style="background: #f0fdf4; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong style="color: #16a34a;">💡 Tip:</strong> If you don't see your items in your game account within 5 minutes, please contact our support team immediately.
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <div style="font-size: 12px; color: #6b7280;">
            <p>Thank you for choosing ${process.env.STORE_NAME}!</p>
            <p>Enjoy your game! Come back for more.</p>
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} ${process.env.STORE_NAME}. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order completion email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send order completion email:', error.message);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendPaymentVerification,
  sendOrderCompletion,
};
