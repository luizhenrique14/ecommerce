// Register User Use Case
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class RegisterUser {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async execute({ email, password, name }) {
    // Validation
    if (!email || !password || !name) {
      return { error: 'Todos os campos são obrigatórios', status: 400 };
    }

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return { error: 'Email já cadastrado', status: 400 };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      status: 201
    };
  }
}

module.exports = RegisterUser;
