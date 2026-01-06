// Login User Use Case
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class LoginUser {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      return { error: 'Email e senha são obrigatórios', status: 400 };
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { error: 'Credenciais inválidas', status: 401 };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Credenciais inválidas', status: 401 };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: user.toResponse(),
      status: 200
    };
  }
}

module.exports = LoginUser;
