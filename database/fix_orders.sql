-- Script para corrigir a tabela orders
-- Execute este script no seu banco de dados (phpMyAdmin ou MySQL Workbench)

-- Verificar se a coluna total_amount existe
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'total_amount';

-- Se não existir, adicionar as colunas:
ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER user_id;
ALTER TABLE orders ADD COLUMN status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' AFTER total_amount;
ALTER TABLE orders ADD COLUMN tracking_code VARCHAR(100) NULL AFTER status;
ALTER TABLE orders ADD COLUMN tracking_status VARCHAR(50) DEFAULT 'pending' AFTER tracking_code;
ALTER TABLE orders ADD COLUMN shipping_address TEXT AFTER tracking_status;

-- Criar tabela order_items se não existir
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados de teste (para user_id = 1)
INSERT INTO orders (user_id, total_amount, status, tracking_code, tracking_status, shipping_address)
VALUES (1, 5999.99, 'shipped', 'TRK-ABC12345', 'in_transit', 'Rua Teste, 123 - São Paulo, SP');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 2, 1, 4999.99);
