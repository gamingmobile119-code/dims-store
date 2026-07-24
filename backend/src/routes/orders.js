const express = require('express');
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getOrders);
router.get('/:orderId', authenticateToken, getOrderById);

module.exports = router;
