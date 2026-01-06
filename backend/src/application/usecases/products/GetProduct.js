// Get Product Use Case
class GetProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      return { error: 'Produto não encontrado', status: 404 };
    }
    return { product: product.toResponse(), status: 200 };
  }
}

module.exports = GetProduct;
