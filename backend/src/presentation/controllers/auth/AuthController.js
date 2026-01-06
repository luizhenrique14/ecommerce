const { logAuth, logCreate } = require('../../../shared/logger');

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
      logAuth(req, 'AUTH_REGISTER', false);
      return res.status(result.status).json({ message: result.error });
    }
    
    // Log do registro com informações do usuário
    logCreate(req, 'USER', req.body.email, { 
      userId: result.user?.id, 
      userEmail: result.user?.email 
    });
    logAuth(req, 'AUTH_REGISTER', true);
    
    return res.status(201).json({ token: result.token, user: result.user });
  }

  async login(req, res) {
    const result = await this.loginUser.execute(req.body);
    if (result.error) {
      logAuth(req, 'AUTH_LOGIN', false);
      return res.status(result.status).json({ message: result.error });
    }
    
    // Log do login com informações do usuário
    logAuth(req, 'AUTH_LOGIN', true, { 
      userId: result.user?.id, 
      userEmail: result.user?.email,
      isAdmin: result.user?.isAdmin 
    });
    
    return res.json({ token: result.token, user: result.user });
  }

  async requestPasswordReset(req, res) {
    const result = await this.requestPasswordReset.execute(req.body);
    if (result.error) {
      logAuth(req, 'AUTH_REQUEST_PASSWORD_RESET', false);
      return res.status(result.status).json({ message: result.error });
    }
    
    logAuth(req, 'AUTH_REQUEST_PASSWORD_RESET', true);
    return res.json({ message: result.message, token: result.token });
  }

  async resetPassword(req, res) {
    const result = await this.resetPassword.execute(req.body);
    if (result.error) {
      logAuth(req, 'AUTH_RESET_PASSWORD', false);
      return res.status(result.status).json({ message: result.error });
    }
    
    logAuth(req, 'AUTH_RESET_PASSWORD', true);
    return res.json({ message: result.message });
  }
}

module.exports = AuthController;
