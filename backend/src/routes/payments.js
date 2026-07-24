const express = require('express');
const { generateMandiriQR, confirmPayment, checkPaymentStatus } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/mandiri-qr', authenticateToken, generateMandiriQR);
router.post('/confirm', authenticateToken, confirmPayment);
router.get('/status/:orderId', checkPaymentStatus);

module.exports = router;
