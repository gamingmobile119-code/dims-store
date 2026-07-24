const express = require('express');
const {
  getDailySales,
  getSalesByGame,
  getOrderStatus,
  getPaymentMethods,
  getTopProducts,
  getAnalyticsOverview
} = require('../controllers/analyticsController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All analytics endpoints require admin access
router.get('/overview', authenticateToken, isAdmin, getAnalyticsOverview);
router.get('/daily-sales', authenticateToken, isAdmin, getDailySales);
router.get('/sales-by-game', authenticateToken, isAdmin, getSalesByGame);
router.get('/order-status', authenticateToken, isAdmin, getOrderStatus);
router.get('/payment-methods', authenticateToken, isAdmin, getPaymentMethods);
router.get('/top-products', authenticateToken, isAdmin, getTopProducts);

module.exports = router;
