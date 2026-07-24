const pool = require('../config/database');

// Get sales data for the last 30 days
const getDailySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status IN ('paid', 'completed')
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    const data = result.rows.map(row => ({
      date: row.date.toLocaleDateString('id-ID'),
      orders: parseInt(row.orders),
      revenue: parseFloat(row.revenue || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Get daily sales error:', error);
    res.status(500).json({ error: 'Failed to fetch daily sales' });
  }
};

// Get sales by game
const getSalesByGame = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.game_name,
        COUNT(DISTINCT o.id) as orders,
        SUM(oi.quantity) as total_items,
        SUM(o.total_amount) as revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status IN ('paid', 'completed')
      GROUP BY p.game_name
      ORDER BY revenue DESC
    `);

    const data = result.rows.map(row => ({
      game_name: row.game_name,
      orders: parseInt(row.orders),
      total_items: parseInt(row.total_items),
      revenue: parseFloat(row.revenue || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Get sales by game error:', error);
    res.status(500).json({ error: 'Failed to fetch sales by game' });
  }
};

// Get order status distribution
const getOrderStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as revenue
      FROM orders
      GROUP BY status
    `);

    const data = result.rows.map(row => ({
      status: row.status,
      count: parseInt(row.count),
      revenue: parseFloat(row.revenue || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
};

// Get payment method distribution
const getPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status IN ('paid', 'completed')
      GROUP BY payment_method
    `);

    const data = result.rows.map(row => ({
      payment_method: row.payment_method || 'unknown',
      count: parseInt(row.count),
      revenue: parseFloat(row.revenue || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
};

// Get top selling products
const getTopProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.game_name,
        p.denomination,
        p.price,
        COUNT(oi.id) as times_sold,
        SUM(oi.quantity) as total_quantity,
        COUNT(oi.id) * SUM(oi.quantity) as total_items_sold,
        SUM(o.total_amount) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'completed')
      GROUP BY p.id, p.game_name, p.denomination, p.price
      ORDER BY revenue DESC NULLS LAST
      LIMIT 10
    `);

    const data = result.rows.map(row => ({
      id: row.id,
      game_name: row.game_name,
      denomination: row.denomination,
      price: parseInt(row.price),
      times_sold: parseInt(row.times_sold || 0),
      total_quantity: parseInt(row.total_quantity || 0),
      total_items_sold: parseInt(row.total_items_sold || 0),
      revenue: parseFloat(row.revenue || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
};

// Get overview stats
const getAnalyticsOverview = async (req, res) => {
  try {
    const [ordersResult, usersResult, revenueResult, avgOrderResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM orders WHERE status IN (\'paid\', \'completed\')'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status IN (\'paid\', \'completed\')'),
      pool.query('SELECT AVG(total_amount) as avg FROM orders WHERE status IN (\'paid\', \'completed\')')
    ]);

    res.json({
      total_orders: parseInt(ordersResult.rows[0].count),
      total_users: parseInt(usersResult.rows[0].count),
      total_revenue: parseFloat(revenueResult.rows[0].total || 0),
      avg_order_value: parseFloat(avgOrderResult.rows[0].avg || 0),
      last_updated: new Date()
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
};

module.exports = {
  getDailySales,
  getSalesByGame,
  getOrderStatus,
  getPaymentMethods,
  getTopProducts,
  getAnalyticsOverview
};
