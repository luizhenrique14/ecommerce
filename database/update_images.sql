-- Script para atualizar os caminhos das imagens para usar /assets/img/
-- Execute este script no MySQL para atualizar os caminhos das imagens no banco de dados

USE ecommerce_db;

-- Atualizar imagens dos produtos existentes
-- Notebook (Laptop) - categoria_id 3
UPDATE products SET 
    image = '/assets/img/laptop1.jpg',
    images = JSON_ARRAY('/assets/img/laptop1.jpg', '/assets/img/laptop2.avif', '/assets/img/laptop3.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'laptop' LIMIT 1);

-- Smartphone - categoria_id 2
UPDATE products SET 
    image = '/assets/img/iphone 15.jpg',
    images = JSON_ARRAY('/assets/img/iphone 15.jpg', '/assets/img/iphone seila.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'smartphone' LIMIT 1);

-- Tablet - categoria_id 7
UPDATE products SET 
    image = '/assets/img/Tablet 1.jpg',
    images = JSON_ARRAY('/assets/img/Tablet 1.jpg', '/assets/img/Tablet 2.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'tablet' LIMIT 1);

-- Fones de Ouvido - categoria_id 1
UPDATE products SET 
    image = '/assets/img/fone2.webp',
    images = JSON_ARRAY('/assets/img/fone2.webp', '/assets/img/Fone3.webp')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'fone' LIMIT 1);

-- Mouse Gamer - categoria_id 4
UPDATE products SET 
    image = '/assets/img/mouse1 2.jpg',
    images = JSON_ARRAY('/assets/img/mouse1 2.jpg', '/assets/img/mouse 2.webp')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'mouse' LIMIT 1);

-- Teclado Mecânico - categoria_id 5
UPDATE products SET 
    image = '/assets/img/teclado.jpg',
    images = JSON_ARRAY('/assets/img/teclado.jpg', '/assets/img/teclado 2.jpg', '/assets/img/teclado 3.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'teclados' LIMIT 1);

-- Capinha iPhone - categoria_id 6
UPDATE products SET 
    image = '/assets/img/Capinha 2.webp',
    images = JSON_ARRAY('/assets/img/Capinha 2.webp')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'capinhas' LIMIT 1);

-- Monitor - categoria_id 8
UPDATE products SET 
    image = '/assets/img/Monito1.jpg',
    images = JSON_ARRAY('/assets/img/Monito1.jpg', '/assets/img/monito2.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'monitor' LIMIT 1);

-- Cabo USB-C - categoria_id 9
UPDATE products SET 
    image = '/assets/img/CAbo USB.webp',
    images = JSON_ARRAY('/assets/img/CAbo USB.webp')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'cabos-acessorios' LIMIT 1);

-- Carregador - categoria_id 10
UPDATE products SET 
    image = '/assets/img/Carregador 1.avif',
    images = JSON_ARRAY('/assets/img/Carregador 1.avif', '/assets/img/CArregador2.webp')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'carregadores' LIMIT 1);

-- Película - categoria_id 11
UPDATE products SET 
    image = '/assets/img/pelicula 2.webp',
    images = JSON_ARRAY('/assets/img/pelicula 2.webp', '/assets/img/[elicula 1.jpg')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'peliculas' LIMIT 1);
