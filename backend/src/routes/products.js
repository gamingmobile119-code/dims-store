const express = require('express');
const { getAllProducts, getProductsByGame, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:gameName', getProductsByGame);
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:productId', authenticateToken, isAdmin, updateProduct);
router.delete('/:productId', authenticateToken, isAdmin, deleteProduct);

module.exports = router;
