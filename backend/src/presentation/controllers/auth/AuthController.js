// Auth Controller
class AuthController {
  constructor(registerUser, loginUser, requestPasswordReset, resetPassword) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.requestPasswordReset = requestPasswordReset;
    this.resetPassword = resetPassword;
  }

  async register(req, res) {
    const result = await this.registerUser.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.status(201).json({ token: result.token, user: result.user });
  }

  async login(req, res) {
    const result = await this.loginUser.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ token: result.token, user: result.user });
  }

  async requestPasswordReset(req, res) {
    const result = await this.requestPasswordReset.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ message: result.message, token: result.token });
  }

  async resetPassword(req, res) {
    const result = await this.resetPassword.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ message: result.message });
  }
}

module.exports = AuthController;
