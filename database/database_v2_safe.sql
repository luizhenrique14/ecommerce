-- Script SQL v2 - Sistema de Categorias e Melhorias (Versão Segura)
-- Execute este script no MySQL para atualizar o banco de dados
-- Esta versão verifica se as colunas existem antes de adicionar

USE ecommerce_db;

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionando tabela para produtos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar e adicionar colunas se não existirem
-- Adicionar category_id
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

-- Adicionar images
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

-- Adicionar stock
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

-- Adicionar updated_at
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

-- Adicionar foreign key (verificar se já existe)
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

-- Adicionar índice (verificar se já existe)
SET @idx_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'products' 
    AND INDEX_NAME = 'idx_category_id');

SET @sql = IF(@idx_exists = 0, 
    'CREATE INDEX idx_category_id ON products(category_id)', 
    'SELECT "Índice idx_category_id já existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Inserir categorias
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

-- Atualizar produtos existentes com categorias e múltiplas imagens
UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'laptop' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Notebook+1', 'https://via.placeholder.com/600x400?text=Notebook+2', 'https://via.placeholder.com/600x400?text=Notebook+3')
WHERE name = 'Notebook';

UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'smartphone' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Smartphone+1', 'https://via.placeholder.com/600x400?text=Smartphone+2', 'https://via.placeholder.com/600x400?text=Smartphone+3')
WHERE name = 'Smartphone';

UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'tablet' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Tablet+1', 'https://via.placeholder.com/600x400?text=Tablet+2')
WHERE name = 'Tablet';

UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'fone' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Fones+1', 'https://via.placeholder.com/600x400?text=Fones+2', 'https://via.placeholder.com/600x400?text=Fones+3')
WHERE name = 'Fones de Ouvido';

UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'mouse' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Mouse+1', 'https://via.placeholder.com/600x400?text=Mouse+2')
WHERE name = 'Mouse Gamer';

UPDATE products SET 
    category_id = (SELECT id FROM categories WHERE slug = 'teclados' LIMIT 1),
    images = JSON_ARRAY('https://via.placeholder.com/600x400?text=Teclado+1', 'https://via.placeholder.com/600x400?text=Teclado+2', 'https://via.placeholder.com/600x400?text=Teclado+3')
WHERE name = 'Teclado Mecânico';

-- Inserir mais produtos de exemplo para diferentes categorias
INSERT INTO products (name, description, price, image, stock, category_id, images) VALUES
('Capinha iPhone 14', 'Capinha protetora para iPhone 14 com design moderno', 89.99, 'https://via.placeholder.com/300x200?text=Capinha', 30, 
 (SELECT id FROM categories WHERE slug = 'capinhas' LIMIT 1),
 JSON_ARRAY('https://via.placeholder.com/600x400?text=Capinha+1', 'https://via.placeholder.com/600x400?text=Capinha+2')),
('Monitor 27" 4K', 'Monitor 27 polegadas 4K UHD com HDR', 1899.99, 'https://via.placeholder.com/300x200?text=Monitor', 8,
 (SELECT id FROM categories WHERE slug = 'monitor' LIMIT 1),
 JSON_ARRAY('https://via.placeholder.com/600x400?text=Monitor+1', 'https://via.placeholder.com/600x400?text=Monitor+2', 'https://via.placeholder.com/600x400?text=Monitor+3')),
('Cabo USB-C 2m', 'Cabo USB-C de alta velocidade 2 metros', 39.99, 'https://via.placeholder.com/300x200?text=Cabo', 50,
 (SELECT id FROM categories WHERE slug = 'cabos-acessorios' LIMIT 1),
 JSON_ARRAY('https://via.placeholder.com/600x400?text=Cabo+1', 'https://via.placeholder.com/600x400?text=Cabo+2')),
('Carregador Rápido 65W', 'Carregador rápido USB-C 65W com múltiplas portas', 149.99, 'https://via.placeholder.com/300x200?text=Carregador', 25,
 (SELECT id FROM categories WHERE slug = 'carregadores' LIMIT 1),
 JSON_ARRAY('https://via.placeholder.com/600x400?text=Carregador+1', 'https://via.placeholder.com/600x400?text=Carregador+2')),
('Película Vidro iPhone', 'Película de vidro temperado para iPhone', 29.99, 'https://via.placeholder.com/300x200?text=Pelicula', 100,
 (SELECT id FROM categories WHERE slug = 'peliculas' LIMIT 1),
 JSON_ARRAY('https://via.placeholder.com/600x400?text=Pelicula+1', 'https://via.placeholder.com/600x400?text=Pelicula+2'))
ON DUPLICATE KEY UPDATE name=name;

