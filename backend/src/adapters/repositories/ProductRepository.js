// Product Repository Adapter
const ProductRepository = require('../../domain/ports/ProductRepository');
const db = require('../database/pool');
const Product = require('../../domain/entities/Product');

function parseImages(product) {
  if (product.images) {
    try {
      product.images = JSON.parse(product.images);
    } catch (e) {
      product.images = product.image ? [product.image] : [];
    }
  } else {
    product.images = product.image ? [product.image] : [];
  }
  return product;
}

class ProductRepositoryAdapter extends ProductRepository {
  async findAll({ category, page = 1, limit = 12, sort = 'name', order = 'ASC' } = {}) {
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

    const allowedSorts = ['name', 'price', 'created_at'];
    const sortColumn = allowedSorts.includes(sort) ? sort : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY p.${sortColumn} ${sortOrder}`;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const results = await db.query(query, params);
    return results.map(r => new Product(parseImages(r)));
  }

  async findById(id) {
    const results = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (results.length === 0) return null;
    return new Product(parseImages(results[0]));
  }

  async create({ name, description, price, image, images, category_id, stock }) {
    const imagesArray = images && Array.isArray(images) && images.length > 0 ? images : [image];
    const result = await db.execute(
      'INSERT INTO products (name, description, price, image, images, category_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), image, JSON.stringify(imagesArray), category_id, stock || 0]
    );
    return this.findById(result.insertId);
  }

  async delete(id) {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  async count({ category } = {}) {
    let query = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];
    if (category) {
      query += ' AND category_id = ?';
      params.push(parseInt(category));
    }
    const results = await db.query(query, params);
    return results[0].total;
  }
}

module.exports = ProductRepositoryAdapter;
