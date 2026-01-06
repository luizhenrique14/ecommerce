// User Controller
class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getProfile(req, res) {
    const user = await this.userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.json(user.toResponse());
  }
}

module.exports = UserController;
