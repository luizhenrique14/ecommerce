const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

// #region agent log
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD,
  envFileExists: fs.existsSync('.env')
});
if (!fs.existsSync('.env')) {
  console.warn('⚠️  WARNING: .env file not found! Using default values.');
  console.warn('   Please create a .env file based on env.example');
}
fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:8',message:'Environment variables check',data:{PORT:process.env.PORT,DB_HOST:process.env.DB_HOST,DB_PORT:process.env.DB_PORT,DB_USER:process.env.DB_USER,DB_NAME:process.env.DB_NAME,envFileExists:fs.existsSync('.env')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
// Fix: Remove port from host if it's included
let dbHost = (process.env.DB_HOST || 'localhost').trim();
// If host contains :port, extract just the host part
if (dbHost.includes(':')) {
  const parts = dbHost.split(':');
  dbHost = parts[0];
  if (!process.env.DB_PORT && parts[1]) {
    // If DB_PORT is not set but host has port, use it
    process.env.DB_PORT = parts[1];
  }
}

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const dbConfig = {
  host: dbHost,
  port: isNaN(dbPort) ? 3306 : dbPort,
  user: (process.env.DB_USER || 'root').trim(),
  password: (process.env.DB_PASSWORD || '').trim(),
  database: (process.env.DB_NAME || 'ecommerce_db').trim(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// #region agent log
console.log('Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  portType: typeof dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password,
  originalDB_HOST: process.env.DB_HOST,
  originalDB_PORT: process.env.DB_PORT
});
if (process.env.DB_HOST && process.env.DB_HOST.includes(':')) {
  console.warn('⚠️  WARNING: DB_HOST contains port. Extracted host:', dbHost);
  console.warn('   Please use DB_HOST=localhost and DB_PORT=3308 separately in .env');
}
fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:45',message:'Database config loaded',data:{host:dbConfig.host,port:dbConfig.port,portType:typeof dbConfig.port,user:dbConfig.user,database:dbConfig.database,originalDB_HOST:process.env.DB_HOST,originalDB_PORT:process.env.DB_PORT},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
// #endregion

const pool = mysql.createPool(dbConfig);

// Initialize database tables
async function initializeDatabase() {
  // #region agent log
  console.log('Attempting database connection...');
  fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:32',message:'Starting database initialization',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const connection = await pool.getConnection();
    // #region agent log
    console.log('Database connection successful');
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:35',message:'Database connection established',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        category_id INT,
        images JSON,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_name (name),
        INDEX idx_category_id (category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add columns if they don't exist (for existing databases)
    try {
      await connection.query('ALTER TABLE products ADD COLUMN category_id INT');
    } catch (e) {
      // Column already exists
    }
    try {
      await connection.query('ALTER TABLE products ADD COLUMN images JSON');
    } catch (e) {
      // Column already exists
    }
    try {
      await connection.query('ALTER TABLE products ADD COLUMN stock INT DEFAULT 0');
    } catch (e) {
      // Column already exists
    }
    try {
      await connection.query('ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    } catch (e) {
      // Column already exists
    }

    // Insert categories if they don't exist
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (categories[0].count === 0) {
      await connection.query(`
        INSERT INTO categories (name, slug, icon) VALUES
        ('Fone', 'fone', 'headphones'),
        ('Smartphone', 'smartphone', 'smartphone'),
        ('Laptop', 'laptop', 'laptop'),
        ('Mouse', 'mouse', 'mouse'),
        ('Teclados', 'teclados', 'keyboard'),
        ('Capinhas', 'capinhas', 'phone_iphone'),
        ('Tablet', 'tablet', 'tablet'),
        ('Monitor', 'monitor', 'monitor'),
        ('Cabos e Acessórios', 'cabos-acessorios', 'cable'),
        ('Carregadores', 'carregadores', 'battery_charging_full'),
        ('Películas', 'peliculas', 'screen_protection')
      `);
    }

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create password reset tokens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default products if table is empty
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (products[0].count === 0) {
      await connection.query(`
        INSERT INTO products (name, description, price, image, category_id, images, stock) VALUES
        ('Fone de Ouvido Premium', 'Fone de ouvido sem fio com cancelamento de ruído ativo', 299.99, 'fone2.webp', 1, JSON_ARRAY('fone2.webp', 'Fone3.webp'), 50),
        ('iPhone 15 Pro', 'Smartphone de última geração com câmera avançada e processador A17', 4999.99, 'iphone 15.jpg', 2, JSON_ARRAY('iphone 15.jpg', 'iphone seila.jpg'), 30),
        ('Laptop Gaming', 'Laptop de alta performance para jogos e edição com RTX 4090', 5999.99, 'laptop1.jpg', 3, JSON_ARRAY('laptop1.jpg', 'laptop2.avif', 'laptop3.jpg'), 15),
        ('Mouse Gamer RGB', 'Mouse com 12000 DPI e iluminação RGB personalizável', 199.99, 'mouse1 2.jpg', 4, JSON_ARRAY('mouse1 2.jpg', 'mouse 2.webp'), 100),
        ('Teclado Mecânico', 'Teclado mecânico com switches RGB e estrutura alumínio', 399.99, 'teclado.jpg', 5, JSON_ARRAY('teclado.jpg', 'teclado 2.jpg', 'teclado 3.jpg'), 45),
        ('Capinha Protetora', 'Capinha resistente com proteção contra quedas', 79.99, 'Capinha 2.webp', 6, JSON_ARRAY('Capinha 2.webp'), 200),
        ('Tablet 12 Polegadas', 'Tablet com tela AMOLED e S-Pen incluído', 2499.99, 'Tablet 1.jpg', 7, JSON_ARRAY('Tablet 1.jpg', 'Tablet 2.jpg'), 25),
        ('Monitor 4K', 'Monitor 4K de 27 polegadas com taxa de 144Hz', 1799.99, 'Monito1.jpg', 8, JSON_ARRAY('Monito1.jpg', 'monito2.jpg'), 20),
        ('Cabo USB-C', 'Cabo USB-C de 2 metros com carga rápida', 49.99, 'CAbo USB.webp', 9, JSON_ARRAY('CAbo USB.webp'), 300),
        ('Carregador Rápido', 'Carregador 65W com múltiplas portas', 149.99, 'Carregador 1.avif', 10, JSON_ARRAY('Carregador 1.avif', 'CArregador2.webp'), 80),
        ('Película Protetora', 'Película de vidro temperado com alta transparência', 29.99, '[elicula 1.jpg', 11, JSON_ARRAY('[elicula 1.jpg', 'pelicula 2.webp'), 500)
      `);
    }

    // Create default admin user if no users exist
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const hashedPassword = await bcrypt.hash('Admin123', 10);
      // #region agent log
      console.log('Creating default admin user...');
      fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:150',message:'Creating admin user',data:{email:'admin@example.com',hashedPasswordLength:hashedPassword.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      await connection.query(`
        INSERT INTO users (email, password, name) VALUES
        ('admin@example.com', ?, 'Administrador')
      `, [hashedPassword]);
      // #region agent log
      console.log('Admin user created successfully');
      fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:156',message:'Admin user created',data:{email:'admin@example.com'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      console.log('Users already exist, skipping admin creation');
      fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:159',message:'Users exist, skipping admin creation',data:{userCount:users[0].count},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
    }

    connection.release();
    console.log('Database initialized successfully');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:98',message:'Database initialized successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    console.error('Error initializing database:', error);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:100',message:'Database initialization error',data:{error:error.message,code:error.code,hostname:error.hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }
}

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const connection = await pool.getConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    connection.release();

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email, name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // #region agent log
    console.log('Login attempt:', { email, hasPassword: !!password, passwordLength: password?.length });
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:195',message:'Login attempt received',data:{email,hasPassword:!!password,passwordLength:password?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const connection = await pool.getConnection();
    
    // Find user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    // #region agent log
    console.log('User lookup result:', { found: users.length > 0, userId: users[0]?.id, userEmail: users[0]?.email });
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:210',message:'User lookup result',data:{found:users.length>0,userId:users[0]?.id,userEmail:users[0]?.email,hasStoredPassword:!!users[0]?.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion

    if (users.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:214',message:'User not found',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      // #endregion
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // #region agent log
    console.log('Password verification:', { isValid: isValidPassword, storedHashLength: user.password?.length, storedHashPrefix: user.password?.substring(0, 10) });
    fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:225',message:'Password verification result',data:{isValid:isValidPassword,storedHashLength:user.password?.length,storedHashPrefix:user.password?.substring(0,10)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    // #endregion

    if (!isValidPassword) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d51c2716-d00b-49dd-bb59-98e7015290dd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'server.js:228',message:'Invalid password',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
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
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Request password reset
app.post('/api/auth/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    const connection = await pool.getConnection();

    // Check if user exists
    const [users] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const userId = users[0].id;

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await connection.query(
      'INSERT INTO password_reset_tokens (user_id, email, token, expires_at) VALUES (?, ?, ?, ?)',
      [userId, email, resetToken, expiresAt]
    );

    connection.release();

    // In a real application, you would send an email here
    // For now, we'll return the token (NOT RECOMMENDED FOR PRODUCTION)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      message: 'Código de reset enviado para seu email',
      // IMPORTANT: Remove this in production! Only for testing
      token: resetToken
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Erro ao solicitar reset de senha' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: 'Email, código e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const connection = await pool.getConnection();

    // Find the reset token
    const [tokens] = await connection.query(
      'SELECT * FROM password_reset_tokens WHERE email = ? AND token = ? AND expires_at > NOW()',
      [email, code]
    );

    if (tokens.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }

    const token = tokens[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, token.user_id]
    );

    // Delete the used reset token
    await connection.query(
      'DELETE FROM password_reset_tokens WHERE id = ?',
      [token.id]
    );

    // Delete any other reset tokens for this user
    await connection.query(
      'DELETE FROM password_reset_tokens WHERE user_id = ?',
      [token.user_id]
    );

    connection.release();

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [categories] = await connection.query('SELECT * FROM categories ORDER BY name');
    connection.release();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
});

// Get products with filters and pagination
app.get('/api/products', async (req, res) => {
  try {
    const { category, page = 1, limit = 12, sort = 'name', order = 'ASC' } = req.query;
    const connection = await pool.getConnection();
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(parseInt(category));
    }

    // Validate sort column
    const allowedSorts = ['name', 'price', 'created_at'];
    const sortColumn = allowedSorts.includes(sort) ? sort : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY p.${sortColumn} ${sortOrder}`;

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [products] = await connection.query(query, params);

    // Parse images JSON for each product
    products.forEach(product => {
      if (product.images) {
        try {
          product.images = JSON.parse(product.images);
        } catch (e) {
          product.images = product.image ? [product.image] : [];
        }
      } else {
        product.images = product.image ? [product.image] : [];
      }
    });

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(parseInt(category));
    }
    const [countResult] = await connection.query(countQuery, countParams);
    const total = countResult[0].total;

    connection.release();

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [products] = await connection.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    connection.release();

    if (products.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Parse images JSON if exists
    const product = products[0];
    if (product.images) {
      try {
        product.images = JSON.parse(product.images);
      } catch (e) {
        product.images = [product.image];
      }
    } else {
      product.images = product.image ? [product.image] : [];
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

// Get user profile (protected)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

// Admin route to create products
app.post('/admin/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, image, category_id, stock } = req.body;

    if (!name || !description || !price || !image || !category_id) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const connection = await pool.getConnection();

    // Check if category exists
    const [categories] = await connection.query(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (categories.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Categoria inválida' });
    }

    // Insert product
    const [result] = await connection.query(
      'INSERT INTO products (name, description, price, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category_id, stock]
    );

    connection.release();

    res.status(201).json({ message: 'Produto cadastrado com sucesso', productId: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Erro ao cadastrar produto' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

