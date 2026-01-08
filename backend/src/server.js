// Application Server - Dependency Injection Container
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Adapters
const db = require('./adapters/database/pool');
const UserRepositoryAdapter = require('./adapters/repositories/UserRepository');
const ProductRepositoryAdapter = require('./adapters/repositories/ProductRepository');
const CategoryRepositoryAdapter = require('./adapters/repositories/CategoryRepository');
const OrderRepositoryAdapter = require('./adapters/repositories/OrderRepository');
const LogRepository = require('./adapters/repositories/LogRepository');

// Services
const LoggerService = require('./application/services/LoggerService');

// Use Cases
const RegisterUser = require('./application/usecases/auth/RegisterUser');
const LoginUser = require('./application/usecases/auth/LoginUser');
const RequestPasswordReset = require('./application/usecases/auth/RequestPasswordReset');
const ResetPassword = require('./application/usecases/auth/ResetPassword');
const ListProducts = require('./application/usecases/products/ListProducts');
const GetProduct = require('./application/usecases/products/GetProduct');
const CreateProduct = require('./application/usecases/products/CreateProduct');
const DeleteProduct = require('./application/usecases/products/DeleteProduct');
const ListCategories = require('./application/usecases/categories/ListCategories');
const CreateCategory = require('./application/usecases/categories/CreateCategory');

// Controllers
const AuthController = require('./presentation/controllers/auth/AuthController');
const ProductController = require('./presentation/controllers/products/ProductController');
const CategoryController = require('./presentation/controllers/categories/CategoryController');
const UserController = require('./presentation/controllers/users/UserController');
const OrderController = require('./presentation/controllers/orders/OrderController');

// Configuration
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Repositories
const userRepository = new UserRepositoryAdapter();
const productRepository = new ProductRepositoryAdapter();
const categoryRepository = new CategoryRepositoryAdapter();
const orderRepository = new OrderRepositoryAdapter();
const logRepository = new LogRepository();

// Initialize Logger Service
const logger = new LoggerService(logRepository);

// Initialize Use Cases
const registerUser = new RegisterUser(userRepository, JWT_SECRET);
const loginUser = new LoginUser(userRepository, JWT_SECRET);
const requestPasswordReset = new RequestPasswordReset();
const resetPassword = new ResetPassword();
const listProducts = new ListProducts(productRepository);
const getProduct = new GetProduct(productRepository);
const createProduct = new CreateProduct(productRepository, categoryRepository);
const deleteProduct = new DeleteProduct(productRepository);
const listCategories = new ListCategories(categoryRepository);
const createCategory = new CreateCategory(categoryRepository);

// Initialize Controllers
const authController = new AuthController(registerUser, loginUser, requestPasswordReset, resetPassword);
const productController = new ProductController(listProducts, getProduct, createProduct, deleteProduct);
const categoryController = new CategoryController(listCategories, createCategory);
const userController = new UserController(userRepository);
const orderController = new OrderController(orderRepository);

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Logging Middleware (deve ser usado após bodyParser)
const loggingMiddleware = require('./presentation/middlewares/loggingMiddleware');
app.use(loggingMiddleware(logger));

// Auth Middleware
const authenticateToken = (req, res, next) => {
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

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado: administrador somente' });
  }
  next();
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/request-password-reset', (req, res) => authController.requestPasswordReset(req, res));
app.post('/api/auth/reset-password', (req, res) => authController.resetPassword(req, res));

// Category Routes
app.get('/api/categories', (req, res) => categoryController.list(req, res));
app.post('/api/categories', authenticateToken, requireAdmin, (req, res) => categoryController.create(req, res));

// Product Routes
app.get('/api/products', (req, res) => productController.list(req, res));
app.get('/api/products/:id', (req, res) => productController.get(req, res));
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => productController.create(req, res));
app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => productController.delete(req, res));

// User Routes
app.get('/api/user/profile', authenticateToken, (req, res) => userController.getProfile(req, res));

// Order Routes
app.post('/api/orders', authenticateToken, (req, res) => orderController.create(req, res));
app.get('/api/orders', authenticateToken, (req, res) => orderController.getUserOrders(req, res));
app.get('/api/orders/:orderId', authenticateToken, (req, res) => orderController.getDetails(req, res));
app.get('/api/orders/track/:trackingCode', (req, res) => orderController.getByTracking(req, res));
app.put('/api/orders/:orderId/status', authenticateToken, requireAdmin, (req, res) => orderController.updateStatus(req, res));
app.put('/api/orders/:orderId/tracking', authenticateToken, requireAdmin, (req, res) => orderController.updateTracking(req, res));
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => orderController.getAll(req, res));

// Database Initialization
async function initializeDatabase() {
  try {
    const connection = await db.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_admin TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // Create API logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        action_type VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        metadata JSON,
        level VARCHAR(20) NOT NULL DEFAULT 'INFO',
        status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
        ip_address VARCHAR(45),
        user_id INT NULL,
        user_email VARCHAR(255) NULL,
        endpoint VARCHAR(500),
        http_method VARCHAR(10),
        response_time INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_action_type (action_type),
        INDEX idx_status (status),
        INDEX idx_level (level),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        tracking_code VARCHAR(100) UNIQUE,
        tracking_status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_tracking_code (tracking_code),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add columns if they don't exist
    try { await connection.query('ALTER TABLE products ADD COLUMN category_id INT'); } catch (e) {}
    try { await connection.query("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0"); } catch (e) {}
    try { await connection.query('ALTER TABLE products ADD COLUMN images JSON'); } catch (e) {}
    try { await connection.query('ALTER TABLE products ADD COLUMN stock INT DEFAULT 0'); } catch (e) {}
    try { await connection.query('ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'); } catch (e) {}
    try { await connection.query('ALTER TABLE api_logs ADD COLUMN user_email VARCHAR(255) NULL'); } catch (e) {}
    
    // Order table migrations - add missing columns
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER user_id');
    } catch (e) {}
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN status ENUM(\'pending\', \'processing\', \'shipped\', \'delivered\', \'cancelled\') DEFAULT \'pending\' AFTER total_amount');
    } catch (e) {}
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN tracking_code VARCHAR(100) UNIQUE AFTER status');
    } catch (e) {}
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN tracking_status VARCHAR(50) DEFAULT \'pending\' AFTER tracking_code');
    } catch (e) {}
    try {
      await connection.query('ALTER TABLE orders ADD COLUMN shipping_address TEXT AFTER tracking_status');
    } catch (e) {}
    
    // Add indexes for orders table
    try { await connection.query('CREATE INDEX idx_orders_tracking ON orders(tracking_code)'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_orders_user ON orders(user_id)'); } catch (e) {}
    
    // Create order_items table if not exists
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    } catch (e) {}

    // Insert default categories
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

    // Insert default products
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

    // Create default admin user
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Admin123', 10);
      await connection.query(`
        INSERT INTO users (email, password, name, is_admin) VALUES
        ('admin@example.com', ?, 'Administrador', 1)
      `, [hashedPassword]);
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

module.exports = app;
