const express = require('express');
const { body, validationResult } = require('express-validator');
const { dbHelpers } = require('../database/db');

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM products WHERE user_id = ?';
    const params = [req.user.id];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const products = dbHelpers.all(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Errore nel recupero prodotti' });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const product = dbHelpers.get(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Errore nel recupero prodotto' });
  }
});

// Create product
router.post('/', [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').trim().notEmpty(),
  body('status').optional().isIn(['active', 'inactive', 'pending'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, status = 'active' } = req.body;

    const result = dbHelpers.run(
      'INSERT INTO products (name, description, price, category, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, category, status, req.user.id]
    );

    const product = dbHelpers.get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Errore nella creazione prodotto' });
  }
});

// Update product
router.put('/:id', [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['active', 'inactive', 'pending'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check ownership
    const existing = dbHelpers.get(
      'SELECT id FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }

    const updates = [];
    const values = [];

    if (req.body.name) {
      updates.push('name = ?');
      values.push(req.body.name);
    }
    if (req.body.description !== undefined) {
      updates.push('description = ?');
      values.push(req.body.description);
    }
    if (req.body.price !== undefined) {
      updates.push('price = ?');
      values.push(req.body.price);
    }
    if (req.body.category) {
      updates.push('category = ?');
      values.push(req.body.category);
    }
    if (req.body.status) {
      updates.push('status = ?');
      values.push(req.body.status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(req.params.id);

    dbHelpers.run(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const product = dbHelpers.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento prodotto' });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  try {
    const result = dbHelpers.run(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione prodotto' });
  }
});

module.exports = router;
