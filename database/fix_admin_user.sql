-- Script para garantir que o usuário admin tenha is_admin = 1
-- Execute este script se o menu administrativo não aparecer

USE ecommerce_db;

-- Verificar se o usuário admin existe e atualizar is_admin
UPDATE users 
SET is_admin = 1 
WHERE email = 'admin@example.com';

-- Verificar resultado
SELECT id, email, name, is_admin 
FROM users 
WHERE email = 'admin@example.com';

-- Se o usuário não existir, criar
INSERT INTO users (email, password, name, is_admin) 
SELECT 'admin@example.com', '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8u8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'Administrador', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

