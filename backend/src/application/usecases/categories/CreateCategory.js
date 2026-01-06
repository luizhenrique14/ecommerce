// Create Category Use Case
class CreateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute({ name, slug, icon }) {
    if (!name || !slug || !icon) {
      return { error: 'Nome, slug e ícone são obrigatórios', status: 400 };
    }

    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) {
      return { error: 'Já existe uma categoria com este slug', status: 400 };
    }

    const category = await this.categoryRepository.create({ name, slug, icon });
    return { message: 'Categoria cadastrada com sucesso', category: category.toResponse(), status: 201 };
  }
}

module.exports = CreateCategory;
