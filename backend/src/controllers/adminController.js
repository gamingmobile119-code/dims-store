const pool = require('../config/database');
const { sendPaymentVerification, sendOrderCompletion } = require('../utils/emailService');

const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.email, u.full_name,
              json_agg(json_build_object('productId', oi.product_id, 'quantity', oi.quantity)) as items
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id, u.email, u.full_name
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'pending_verification', 'paid', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [status, new Date(), orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order with user email for sending notifications
    const orderWithUser = await pool.query(
      `SELECT o.*, u.email FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderWithUser.rows.length > 0) {
      const order = orderWithUser.rows[0];
      
      // Send emails based on status change
      if (status === 'paid') {
        sendPaymentVerification(order.email, order).catch(err => 
          console.error('Email send error:', err)
        );
      } else if (status === 'completed') {
        sendOrderCompletion(order.email, order).catch(err => 
          console.error('Email send error:', err)
        );
      }
    }

    res.json({ message: 'Order status updated', order: result.rows[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

const getStats = async (req, res) => {
  try {
    const [ordersResult, usersResult, revenueResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM orders'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status = $1', ['paid'])
    ]);

    res.json({
      totalOrders: parseInt(ordersResult.rows[0].count),
      totalUsers: parseInt(usersResult.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].total || 0)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = { getAllOrders, updateOrderStatus, getStats };
