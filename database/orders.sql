-- =====================================================
-- SISTEMA DE PEDIDOS - ECOMMERCE
-- =====================================================

-- 1. CRIAR TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    tracking_code VARCHAR(100),
    tracking_status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_tracking_code (tracking_code),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CRIAR TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. INSERIR PEDIDOS DE TESTE (para user_id = 1)
-- Pedido 1: Enviado
INSERT INTO orders (user_id, total_amount, status, tracking_code, tracking_status, shipping_address)
VALUES (1, 5999.99, 'shipped', 'TRK-ABC12345', 'in_transit', 'Rua Teste, 123 - São Paulo, SP');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 2, 1, 4999.99);

-- Pedido 2: Entregue
INSERT INTO orders (user_id, total_amount, status, tracking_code, tracking_status, shipping_address)
VALUES (1, 349.98, 'delivered', 'TRK-DEF67890', 'delivered', 'Avenida Principal, 456 - Rio de Janeiro, RJ');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES 
  (2, 1, 1, 299.99),
  (2, 4, 1, 49.99);

-- Pedido 3: Pendente
INSERT INTO orders (user_id, total_amount, status, tracking_code, tracking_status, shipping_address)
VALUES (1, 2249.98, 'pending', NULL, 'pending', 'Praça da Sé, 789 - São Paulo, SP');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES 
  (3, 7, 1, 1999.99),
  (3, 10, 1, 149.99),
  (3, 9, 2, 49.99);

-- 4. VIEW PARA HISTÓRICO DO CLIENTE
CREATE OR REPLACE VIEW customer_order_history AS
SELECT
    o.id AS order_id,
    o.tracking_code,
    o.status AS order_status,
    o.tracking_status,
    o.total_amount,
    o.shipping_address,
    o.created_at,
    o.updated_at,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
