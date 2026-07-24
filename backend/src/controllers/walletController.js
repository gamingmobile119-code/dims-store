const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    let result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      // Create wallet if doesn't exist
      const walletId = uuidv4();
      await pool.query(
        'INSERT INTO wallets (id, user_id, balance, created_at) VALUES ($1, $2, $3, $4)',
        [walletId, userId, 0, new Date()]
      );
      result = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const topUpWallet = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: 'Amount and payment method required' });
    }

    // Create transaction record
    const transactionId = uuidv4();
    await pool.query(
      'INSERT INTO wallet_transactions (id, user_id, type, amount, payment_method, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [transactionId, userId, 'topup', amount, paymentMethod, 'pending', new Date()]
    );

    res.status(201).json({ message: 'Top-up request created', transactionId });
  } catch (error) {
    console.error('Top-up wallet error:', error);
    res.status(500).json({ error: 'Failed to top-up wallet' });
  }
};

const useWallet = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user.id;

    // Get wallet
    const walletResult = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    if (walletResult.rows.length === 0 || walletResult.rows[0].balance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct balance
    await pool.query(
      'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
      [amount, userId]
    );

    // Create transaction record
    const transactionId = uuidv4();
    await pool.query(
      'INSERT INTO wallet_transactions (id, user_id, type, amount, payment_method, status, reference_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [transactionId, userId, 'payment', amount, 'wallet', 'completed', orderId, new Date()]
    );

    res.json({ message: 'Payment processed from wallet', transactionId });
  } catch (error) {
    console.error('Use wallet error:', error);
    res.status(500).json({ error: 'Failed to process wallet payment' });
  }
};

module.exports = { getWallet, getWalletTransactions, topUpWallet, useWallet };
