// Category Entity
class Category {
  constructor({ id, name, slug, icon, created_at }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.icon = icon;
    this.createdAt = created_at;
  }

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      icon: this.icon
    };
  }
}

module.exports = Category;
