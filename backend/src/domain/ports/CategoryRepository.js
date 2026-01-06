// Category Repository Port (Interface)
class CategoryRepository {
  async findAll() { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findBySlug(slug) { throw new Error('Not implemented'); }
  async create(categoryData) { throw new Error('Not implemented'); }
}

module.exports = CategoryRepository;
