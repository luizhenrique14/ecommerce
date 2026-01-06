// Product Repository Port (Interface)
class ProductRepository {
  async findAll(filters = {}) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async create(productData) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async count(filters = {}) { throw new Error('Not implemented'); }
}

module.exports = ProductRepository;
