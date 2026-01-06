const { logCreate, logDelete } = require('../../../shared/logger');

// Product Controller
class ProductController {
  constructor(listProducts, getProduct, createProduct, deleteProduct) {
    this.listProducts = listProducts;
    this.getProduct = getProduct;
    this.createProduct = createProduct;
    this.deleteProduct = deleteProduct;
  }

  async list(req, res) {
    const result = await this.listProducts.execute(req.query);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json(result);
  }

  async get(req, res) {
    const result = await this.getProduct.execute(req.params.id);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json(result.product);
  }

  async create(req, res) {
    const result = await this.createProduct.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    
    // Log da criação do produto com o usuário que realizou a ação
    logCreate(req, 'PRODUCT', req.body.name, { productId: result.product?.id });
    
    return res.status(201).json(result);
  }

  async delete(req, res) {
    const result = await this.deleteProduct.execute(req.params.id);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    
    // Log da exclusão do produto com o usuário que realizou a ação
    logDelete(req, 'PRODUCT', req.params.id);
    
    return res.json({ message: result.message });
  }
}

module.exports = ProductController;
