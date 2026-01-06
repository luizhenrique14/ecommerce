// List Categories Use Case
class ListCategories {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    const categories = await this.categoryRepository.findAll();
    return { categories: categories.map(c => c.toResponse()), status: 200 };
  }
}

module.exports = ListCategories;
