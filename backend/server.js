const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
// Users table
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Products table
db.exec(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

// Create default admin user (password: admin123)
const defaultPassword = bcrypt.hashSync('admin123', 10);
const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)');
insertUser.run('admin@example.com', defaultPassword, 'Admin User');

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token non valido' });
    }
    req.user = user;
    next();
  });
};

// Helper: Database query (better-sqlite3 is synchronous)
const dbGet = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    return stmt.get(params);
  } catch (error) {
    throw error;
  }
};

const dbAll = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    return stmt.all(params);
  } catch (error) {
    throw error;
  }
};

const dbRun = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(params);
    return { id: Number(result.lastInsertRowid), changes: result.changes };
  } catch (error) {
    throw error;
  }
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = dbRun(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.id, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.id,
        email,
        name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
});

// Login
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
  try {
    const user = dbGet(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Errore nel recupero utente' });
  }
});

// ==================== PRODUCT ROUTES ====================

// Get all products
app.get('/api/products', authenticateToken, (req, res) => {
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

    const products = dbAll(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Errore nel recupero prodotti' });
  }
});

// Get single product
app.get('/api/products/:id', authenticateToken, (req, res) => {
  try {
    const product = dbGet(
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
app.post('/api/products', authenticateToken, [
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

    const result = dbRun(
      'INSERT INTO products (name, description, price, category, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, category, status, req.user.id]
    );

    const product = dbGet('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Errore nella creazione prodotto' });
  }
});

// Update product
app.put('/api/products/:id', authenticateToken, [
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
    const existing = dbGet(
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

    dbRun(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const product = dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento prodotto' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  try {
    const result = dbRun(
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

// Get categories
app.get('/api/categories', authenticateToken, (req, res) => {
  try {
    const categories = dbAll(
      'SELECT DISTINCT category FROM products WHERE user_id = ? ORDER BY category',
      [req.user.id]
    );
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Errore nel recupero categorie' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Errore interno del server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔑 Default admin: admin@example.com / admin123`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  try {
    db.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error closing database:', err);
  }
  process.exit(0);
});
