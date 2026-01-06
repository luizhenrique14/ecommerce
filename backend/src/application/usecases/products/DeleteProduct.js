// Delete Product Use Case
class DeleteProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    if (!id || isNaN(id)) {
      return { error: 'ID do produto inválido', status: 400 };
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      return { error: 'Produto não encontrado', status: 404 };
    }

    await this.productRepository.delete(id);
    return { message: 'Produto excluído com sucesso', status: 200 };
  }
}

module.exports = DeleteProduct;
