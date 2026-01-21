const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
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
}

// Database query helpers
const dbHelpers = {
  get: (query, params = []) => {
    try {
      const stmt = db.prepare(query);
      return stmt.get(params);
    } catch (error) {
      throw error;
    }
  },

  all: (query, params = []) => {
    try {
      const stmt = db.prepare(query);
      return stmt.all(params);
    } catch (error) {
      throw error;
    }
  },

  run: (query, params = []) => {
    try {
      const stmt = db.prepare(query);
      const result = stmt.run(params);
      return { id: Number(result.lastInsertRowid), changes: result.changes };
    } catch (error) {
      throw error;
    }
  }
};

// Initialize on module load
initializeDatabase();

module.exports = {
  db,
  dbHelpers,
  initializeDatabase
};
