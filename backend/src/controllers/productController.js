const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE active = true ORDER BY game_name, denomination');
    res.json(result.rows);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getProductsByGame = async (req, res) => {
  try {
    const { gameName } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE game_name = $1 AND active = true ORDER BY price', [gameName]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products by game error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { gameName, denomination, price, description } = req.body;

    if (!gameName || !denomination || !price) {
      return res.status(400).json({ error: 'Game name, denomination, and price required' });
    }

    const productId = uuidv4();
    await pool.query(
      'INSERT INTO products (id, game_name, denomination, price, description, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [productId, gameName, denomination, price, description || null, true, new Date()]
    );

    res.status(201).json({ message: 'Product created successfully', productId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { gameName, denomination, price, description, active } = req.body;

    const result = await pool.query(
      'UPDATE products SET game_name = $1, denomination = $2, price = $3, description = $4, active = $5, updated_at = $6 WHERE id = $7 RETURNING *',
      [gameName, denomination, price, description || null, active !== undefined ? active : true, new Date(), productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = { getAllProducts, getProductsByGame, createProduct, updateProduct, deleteProduct };
