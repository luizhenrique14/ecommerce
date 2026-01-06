// List Products Use Case
class ListProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ category, page = 1, limit = 12, sort = 'name', order = 'ASC' } = {}) {
    const [products, total] = await Promise.all([
      this.productRepository.findAll({ category, page, limit, sort, order }),
      this.productRepository.count({ category })
    ]);

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    return {
      products: products.map(p => p.toResponse()),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      status: 200
    };
  }
}

module.exports = ListProducts;
