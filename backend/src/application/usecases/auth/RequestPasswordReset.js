// Request Password Reset Use Case
const crypto = require('crypto');
const path = require('path');
const db = require(path.join(__dirname, '..', '..', '..', 'adapters', 'database', 'pool'));

class RequestPasswordReset {
  constructor(emailService = null) {
    this.emailService = emailService;
  }

  async execute({ email }) {
    if (!email) {
      return { error: 'Email é obrigatório', status: 400 };
    }

    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Retorna sucesso mesmo se o email não existe (segurança)
      return {
        message: 'Se o email existir, um código de recuperação será enviado',
        status: 200
      };
    }

    const userId = users[0].id;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Delete any existing tokens for this user
    await db.execute('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId]);

    await db.execute(
      'INSERT INTO password_reset_tokens (user_id, email, token, expires_at) VALUES (?, ?, ?, ?)',
      [userId, email, resetToken, expiresAt]
    );

    // Log do link de recuperação (para testes - em produção, enviar email real)
    const resetLink = `http://localhost:4200/reset-password?email=${encodeURIComponent(email)}&code=${resetToken}`;
    console.log('========================================');
    console.log('🔐 LINK DE RECUPERAÇÃO DE SENHA:');
    console.log(resetLink);
    console.log('========================================');

    // Enviar email se o serviço estiver configurado
    if (this.emailService) {
      const emailResult = await this.emailService.sendPasswordResetEmail(email, resetToken);
      if (!emailResult.success) {
        console.error('Erro ao enviar email:', emailResult.error);
      }
    }

    return {
      message: 'Código de recuperação enviado para seu email!',
      status: 200
    };
  }
}

module.exports = RequestPasswordReset;
