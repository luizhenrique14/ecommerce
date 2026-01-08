-- Script para dropar e recriar a tabela orders
-- Execute no phpMyAdmin ou MySQL Workbench

-- DROPAR as tabelas (se existirem)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- O servidor vai recriar automaticamente as tabelas ao iniciar
-- Ou execute o script orders.sql para criar novamente
