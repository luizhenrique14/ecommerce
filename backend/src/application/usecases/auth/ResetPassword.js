// Reset Password Use Case
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require(path.join(__dirname, '..', '..', '..', 'adapters', 'database', 'pool'));

class ResetPassword {
  async execute({ email, code, password }) {
    if (!email || !code || !password) {
      return { error: 'Email, código e senha são obrigatórios', status: 400 };
    }

    if (password.length < 6) {
      return { error: 'Senha deve ter no mínimo 6 caracteres', status: 400 };
    }

    const tokens = await db.query(
      'SELECT * FROM password_reset_tokens WHERE email = ? AND token = ? AND expires_at > NOW()',
      [email, code]
    );

    if (tokens.length === 0) {
      return { error: 'Código inválido ou expirado', status: 400 };
    }

    const token = tokens[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, token.user_id]);
    await db.execute('DELETE FROM password_reset_tokens WHERE user_id = ?', [token.user_id]);

    return { message: 'Senha redefinida com sucesso', status: 200 };
  }
}

module.exports = ResetPassword;
