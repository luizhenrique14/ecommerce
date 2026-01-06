-- ============================================================================
-- SCRIPT PRINCIPAL DE INICIALIZAÇÃO DO BANCO DE DADOS - ECOMMERCE
-- ============================================================================
-- Este script cria e inicializa todo o banco de dados do sistema de ecommerce.
-- Pode ser executado múltiplas vezes sem causar erros (idempotente).
-- Execute este script quando o banco estiver vazio ou para resetar o banco.
-- ============================================================================

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- ============================================================================
-- 1. CRIAÇÃO DE TABELAS
-- ============================================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de produtos
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
    INDEX idx_name (name),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    shipping_name VARCHAR(255),
    shipping_city VARCHAR(255),
    shipping_zip_code VARCHAR(20),
    shipping_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de tokens de recuperação de senha
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs da API (para auditoria e rastreabilidade)
CREATE TABLE IF NOT EXISTS api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL COMMENT 'Tipo da ação (ex: AUTH_LOGIN, PRODUCT_CREATE)',
    message TEXT NOT NULL COMMENT 'Mensagem descritiva do log',
    metadata JSON COMMENT 'Metadados adicionais em formato JSON',
    level VARCHAR(20) NOT NULL DEFAULT 'INFO' COMMENT 'Nível do log (DEBUG, INFO, WARN, ERROR)',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' COMMENT 'Status da operação (SUCCESS, ERROR, WARNING)',
    ip_address VARCHAR(45) COMMENT 'Endereço IP do cliente',
    user_id INT NULL COMMENT 'ID do usuário (se autenticado)',
    user_email VARCHAR(255) NULL COMMENT 'Email do usuário (se autenticado)',
    endpoint VARCHAR(500) COMMENT 'Endpoint acessado',
    http_method VARCHAR(10) COMMENT 'Método HTTP (GET, POST, PUT, DELETE)',
    response_time INT COMMENT 'Tempo de resposta em milissegundos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data/hora de criação do registro',
    INDEX idx_action_type (action_type),
    INDEX idx_status (status),
    INDEX idx_level (level),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action_status (action_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabela central de logs para auditoria e rastreabilidade da API';

-- ============================================================================
-- 2. ADICIONAR COLUNAS E CONSTRAINTS (SE NÃO EXISTIREM)
-- ============================================================================

-- Adicionar coluna category_id em products (se não existir)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'category_id');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN category_id INT', 
    'SELECT "Coluna category_id já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna images em products (se não existir)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'images');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN images JSON', 
    'SELECT "Coluna images já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna stock em products (se não existir)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'stock');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN stock INT DEFAULT 0', 
    'SELECT "Coluna stock já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna updated_at em products (se não existir)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'updated_at');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 
    'SELECT "Coluna updated_at já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar coluna is_admin em users (se não existir)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'is_admin');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0', 
    'SELECT "Coluna is_admin já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key category_id -> categories.id (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND CONSTRAINT_NAME = 'fk_product_category'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE products ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL', 
    'SELECT "Foreign key fk_product_category já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key orders.user_id -> users.id (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'orders' 
    AND CONSTRAINT_NAME = 'fk_order_user'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE orders ADD CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE', 
    'SELECT "Foreign key fk_order_user já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key order_items.order_id -> orders.id (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'order_items' 
    AND CONSTRAINT_NAME = 'fk_order_item_order'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE order_items ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE', 
    'SELECT "Foreign key fk_order_item_order já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key order_items.product_id -> products.id (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'order_items' 
    AND CONSTRAINT_NAME = 'fk_order_item_product'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE order_items ADD CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE', 
    'SELECT "Foreign key fk_order_item_product já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key password_reset_tokens.user_id -> users.id (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'password_reset_tokens' 
    AND CONSTRAINT_NAME = 'fk_reset_token_user'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE password_reset_tokens ADD CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE', 
    'SELECT "Foreign key fk_reset_token_user já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 3. INSERIR DADOS INICIAIS
-- ============================================================================

-- Inserir categorias (se não existirem)
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
ON DUPLICATE KEY UPDATE name=name;

-- Inserir produtos (apenas se a tabela estiver vazia)
-- As imagens usam caminhos relativos que serão resolvidos pelo frontend como /assets/img/
INSERT INTO products (name, description, price, image, category_id, images, stock) VALUES
-- Fones de Ouvido
('Fone de Ouvido Premium', 'Fone de ouvido sem fio com cancelamento de ruído ativo', 299.99, 
 '/assets/img/fone2.webp', 
 (SELECT id FROM categories WHERE slug = 'fone' LIMIT 1),
 JSON_ARRAY('/assets/img/fone2.webp', '/assets/img/Fone3.webp'), 50),

-- Smartphones
('iPhone 15 Pro', 'Smartphone de última geração com câmera avançada e processador A17', 4999.99, 
 '/assets/img/iphone 15.jpg', 
 (SELECT id FROM categories WHERE slug = 'smartphone' LIMIT 1),
 JSON_ARRAY('/assets/img/iphone 15.jpg', '/assets/img/iphone seila.jpg'), 30),

-- Laptops
('Laptop Gaming', 'Laptop de alta performance para jogos e edição com RTX 4090', 5999.99, 
 '/assets/img/laptop1.jpg', 
 (SELECT id FROM categories WHERE slug = 'laptop' LIMIT 1),
 JSON_ARRAY('/assets/img/laptop1.jpg', '/assets/img/laptop2.avif', '/assets/img/laptop3.jpg'), 15),

-- Mouse
('Mouse Gamer RGB', 'Mouse com 12000 DPI e iluminação RGB personalizável', 199.99, 
 '/assets/img/mouse1 2.jpg', 
 (SELECT id FROM categories WHERE slug = 'mouse' LIMIT 1),
 JSON_ARRAY('/assets/img/mouse1 2.jpg', '/assets/img/mouse 2.webp'), 100),

-- Teclados
('Teclado Mecânico', 'Teclado mecânico com switches RGB e estrutura alumínio', 399.99, 
 '/assets/img/teclado.jpg', 
 (SELECT id FROM categories WHERE slug = 'teclados' LIMIT 1),
 JSON_ARRAY('/assets/img/teclado.jpg', '/assets/img/teclado 2.jpg', '/assets/img/teclado 3.jpg'), 45),

-- Capinhas
('Capinha Protetora iPhone', 'Capinha resistente com proteção contra quedas', 79.99, 
 '/assets/img/Capinha 2.webp', 
 (SELECT id FROM categories WHERE slug = 'capinhas' LIMIT 1),
 JSON_ARRAY('/assets/img/Capinha 2.webp'), 200),

-- Tablets
('Tablet 12 Polegadas', 'Tablet com tela AMOLED e S-Pen incluído', 2499.99, 
 '/assets/img/Tablet 1.jpg', 
 (SELECT id FROM categories WHERE slug = 'tablet' LIMIT 1),
 JSON_ARRAY('/assets/img/Tablet 1.jpg', '/assets/img/Tablet 2.jpg'), 25),

-- Monitores
('Monitor 4K', 'Monitor 4K de 27 polegadas com taxa de 144Hz', 1799.99, 
 '/assets/img/Monito1.jpg', 
 (SELECT id FROM categories WHERE slug = 'monitor' LIMIT 1),
 JSON_ARRAY('/assets/img/Monito1.jpg', '/assets/img/monito2.jpg'), 20),

-- Cabos
('Cabo USB-C', 'Cabo USB-C de 2 metros com carga rápida', 49.99, 
 '/assets/img/CAbo USB.webp', 
 (SELECT id FROM categories WHERE slug = 'cabos-acessorios' LIMIT 1),
 JSON_ARRAY('/assets/img/CAbo USB.webp'), 300),

-- Carregadores
('Carregador Rápido 65W', 'Carregador 65W com múltiplas portas', 149.99, 
 '/assets/img/Carregador 1.avif', 
 (SELECT id FROM categories WHERE slug = 'carregadores' LIMIT 1),
 JSON_ARRAY('/assets/img/Carregador 1.avif', '/assets/img/CArregador2.webp'), 80),

-- Películas
('Película Protetora', 'Película de vidro temperado com alta transparência', 29.99, 
 '/assets/img/pelicula 2.webp', 
 (SELECT id FROM categories WHERE slug = 'peliculas' LIMIT 1),
 JSON_ARRAY('/assets/img/pelicula 2.webp', '/assets/img/[elicula 1.jpg'), 500)

ON DUPLICATE KEY UPDATE name=name;

-- ============================================================================
-- 4. VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Banco de dados inicializado com sucesso!' AS status;
SELECT COUNT(*) AS total_categorias FROM categories;
SELECT COUNT(*) AS total_produtos FROM products;
SELECT COUNT(*) AS total_usuarios FROM users;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- NOTA: O usuário admin padrão será criado pelo backend na primeira execução
-- Email: admin@example.com
-- Senha: Admin123
-- ============================================================================

