const express = require('express');
const { getWallet, getWalletTransactions, topUpWallet, useWallet } = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getWallet);
router.get('/transactions', authenticateToken, getWalletTransactions);
router.post('/topup', authenticateToken, topUpWallet);
router.post('/use', authenticateToken, useWallet);

module.exports = router;
