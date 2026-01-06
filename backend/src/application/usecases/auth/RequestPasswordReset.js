// Request Password Reset Use Case
const crypto = require('crypto');
const path = require('path');
const db = require(path.join(__dirname, '..', '..', '..', 'adapters', 'database', 'pool'));

class RequestPasswordReset {
  async execute({ email }) {
    if (!email) {
      return { error: 'Email é obrigatório', status: 400 };
    }

    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return { error: 'Usuário não encontrado', status: 404 };
    }

    const userId = users[0].id;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.execute(
      'INSERT INTO password_reset_tokens (user_id, email, token, expires_at) VALUES (?, ?, ?, ?)',
      [userId, email, resetToken, expiresAt]
    );

    return {
      message: 'Código de reset enviado para seu email',
      token: resetToken,
      status: 200
    };
  }
}

module.exports = RequestPasswordReset;
