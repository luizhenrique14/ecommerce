// Create Product Use Case
class CreateProduct {
  constructor(productRepository, categoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute({ name, description, price, image, images, category_id, stock }) {
    if (!name || !description || price === undefined || !image || !category_id) {
      return { error: 'Nome, descrição, preço, imagem e categoria são obrigatórios', status: 400 };
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      return { error: 'Preço inválido', status: 400 };
    }

    const category = await this.categoryRepository.findById(category_id);
    if (!category) {
      return { error: 'Categoria inválida', status: 400 };
    }

    const product = await this.productRepository.create({
      name,
      description,
      price,
      image,
      images,
      category_id,
      stock
    });

    return { message: 'Produto cadastrado com sucesso', product: product.toResponse(), status: 201 };
  }
}

module.exports = CreateProduct;
