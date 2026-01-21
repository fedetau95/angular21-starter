const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const { authenticateToken } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/products', authenticateToken, productRoutes);

// Categories endpoint (backward compatibility)
app.get('/api/categories', authenticateToken, (req, res) => {
  const { dbHelpers } = require('./database/db');
  try {
    const categories = dbHelpers.all(
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
  console.log(`📊 Database initialized`);
  console.log(`🔑 Default admin: admin@example.com / admin123`);
});

// Graceful shutdown
const { db } = require('./database/db');
process.on('SIGINT', () => {
  try {
    db.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error closing database:', err);
  }
  process.exit(0);
});
