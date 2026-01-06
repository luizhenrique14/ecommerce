// User Repository Adapter
const UserRepository = require('../../domain/ports/UserRepository');
const db = require('../database/pool');
const User = require('../../domain/entities/User');

class UserRepositoryAdapter extends UserRepository {
  async findByEmail(email) {
    const results = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) return null;
    return new User(results[0]);
  }

  async findById(id) {
    const results = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (results.length === 0) return null;
    return new User(results[0]);
  }

  async create({ email, password, name }) {
    const result = await db.execute(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, password, name]
    );
    return { id: result.insertId, email, name };
  }

  async updatePassword(userId, hashedPassword) {
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  }
}

module.exports = UserRepositoryAdapter;
