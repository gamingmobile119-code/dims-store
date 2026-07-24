const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { sendOrderConfirmation } = require('../utils/emailService');

const createOrder = async (req, res) => {
  try {
    const { products, paymentMethod, accountInfo } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Products required' });
    }

    let totalAmount = 0;
    for (const item of products) {
      const productResult = await pool.query('SELECT price FROM products WHERE id = $1', [item.productId]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      totalAmount += productResult.rows[0].price * item.quantity;
    }

    const orderId = uuidv4();
    
    await pool.query(
      'INSERT INTO orders (id, user_id, total_amount, status, payment_method, account_info, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [orderId, userId, totalAmount, 'pending', paymentMethod, accountInfo || null, new Date()]
    );

    // Add order items
    for (const item of products) {
      await pool.query(
        'INSERT INTO order_items (id, order_id, product_id, quantity, created_at) VALUES ($1, $2, $3, $4, $5)',
        [uuidv4(), orderId, item.productId, item.quantity, new Date()]
      );
    }

    // Get user email for sending confirmation
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length > 0) {
      const orderLink = `${process.env.STORE_URL}/orders/${orderId}`;
      const order = { id: orderId, total_amount: totalAmount, payment_method: paymentMethod, status: 'pending', created_at: new Date() };
      
      // Send confirmation email (non-blocking)
      sendOrderConfirmation(userResult.rows[0].email, order, orderLink).catch(err => 
        console.error('Email send error:', err)
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      totalAmount,
      paymentMethod
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('productId', oi.product_id, 'quantity', oi.quantity)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('productId', oi.product_id, 'quantity', oi.quantity)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
