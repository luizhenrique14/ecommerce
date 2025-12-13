-- Script SQL para criar o banco de dados e tabelas do Ecommerce
-- Execute este script no MySQL antes de iniciar o backend

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
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
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin padrão (senha: Admin123)
-- A senha será hashada pelo backend, mas você pode inserir manualmente se necessário
-- INSERT INTO users (email, password, name) VALUES 
-- ('admin@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'Administrador');

-- Inserir produtos iniciais
INSERT INTO products (name, description, price, image, stock) VALUES
('Notebook', 'Notebook de alta performance com 16GB RAM e SSD 512GB', 2999.99, 'https://via.placeholder.com/300x200?text=Notebook', 10),
('Smartphone', 'Smartphone com tela de 6.5 polegadas e câmera tripla', 1299.99, 'https://via.placeholder.com/300x200?text=Smartphone', 15),
('Tablet', 'Tablet com tela de 10 polegadas e 128GB de armazenamento', 899.99, 'https://via.placeholder.com/300x200?text=Tablet', 8),
('Fones de Ouvido', 'Fones de ouvido sem fio com cancelamento de ruído', 299.99, 'https://via.placeholder.com/300x200?text=Fones', 20),
('Mouse Gamer', 'Mouse gamer com RGB e 12000 DPI', 199.99, 'https://via.placeholder.com/300x200?text=Mouse', 25),
('Teclado Mecânico', 'Teclado mecânico com switches RGB', 399.99, 'https://via.placeholder.com/300x200?text=Teclado', 12)
ON DUPLICATE KEY UPDATE name=name;

