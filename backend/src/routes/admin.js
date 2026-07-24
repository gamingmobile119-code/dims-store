const express = require('express');
const { getAllOrders, updateOrderStatus, getStats } = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/orders', authenticateToken, isAdmin, getAllOrders);
router.put('/orders/:orderId', authenticateToken, isAdmin, updateOrderStatus);
router.get('/stats', authenticateToken, isAdmin, getStats);

module.exports = router;
