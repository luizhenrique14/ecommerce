// User Entity
class User {
  constructor({ id, email, password, name, is_admin, created_at }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.isAdmin = !!is_admin;
    this.createdAt = created_at;
  }

  toResponse() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin
    };
  }
}

module.exports = User;
