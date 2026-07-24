const QRCode = require('qrcode');
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const generateMandiriQR = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount required' });
    }

    // Check if order belongs to user
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.user.id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate QR string for Mandiri (simplified format)
    // Format: <MANDIRI_ACCOUNT>|<AMOUNT>|<ORDER_ID>
    const qrString = `${process.env.MANDIRI_ACCOUNT}|${amount}|${orderId}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrString);

    // Save payment record
    const paymentId = uuidv4();
    await pool.query(
      'INSERT INTO payments (id, order_id, payment_method, amount, qr_data, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [paymentId, orderId, 'mandiri_qr', amount, qrCode, 'pending', new Date()]
    );

    res.json({
      paymentId,
      qrCode,
      amount,
      orderId,
      accountName: process.env.MANDIRI_ACCOUNT_NAME,
      accountNumber: process.env.MANDIRI_ACCOUNT,
      instruction: 'Scan QR code dengan ATM Mandiri atau Mobile Banking untuk transfer'
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentProof } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    // Update order status
    await pool.query(
      'UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 AND user_id = $4',
      ['pending_verification', new Date(), orderId, req.user.id]
    );

    res.json({ message: 'Payment submitted for verification' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
};

module.exports = { generateMandiriQR, confirmPayment, checkPaymentStatus };
