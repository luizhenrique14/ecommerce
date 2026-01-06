// Category Repository Adapter
const CategoryRepository = require('../../domain/ports/CategoryRepository');
const db = require('../database/pool');
const Category = require('../../domain/entities/Category');

class CategoryRepositoryAdapter extends CategoryRepository {
  async findAll() {
    const results = await db.query('SELECT * FROM categories ORDER BY name');
    return results.map(r => new Category(r));
  }

  async findById(id) {
    const results = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (results.length === 0) return null;
    return new Category(results[0]);
  }

  async findBySlug(slug) {
    const results = await db.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    if (results.length === 0) return null;
    return new Category(results[0]);
  }

  async create({ name, slug, icon }) {
    const result = await db.execute(
      'INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)',
      [name, slug, icon]
    );
    return { id: result.insertId, name, slug, icon };
  }
}

module.exports = CategoryRepositoryAdapter;
