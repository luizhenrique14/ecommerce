// Email Service using Nodemailer
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@ecommerce.com';
    this.fromName = process.env.FROM_NAME || 'Ecommerce';
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `http://localhost:4200/reset-password?email=${encodeURIComponent(email)}&code=${resetToken}`;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: email,
      subject: 'Recuperação de Senha - Ecommerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperação de Senha</h2>
          <p>Você solicitou a recuperação de senha da sua conta.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Recuperar Senha
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Este link expira em 1 hora.<br>
            Se você não solicitou esta recuperação, ignore este email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Ecommerce - Sua loja online
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor de email configurado corretamente');
      return true;
    } catch (error) {
      console.error('❌ Erro na configuração do email:', error);
      return false;
    }
  }
}

module.exports = EmailService;
