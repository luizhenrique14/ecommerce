const { logCreate } = require('../../../shared/logger');

// Category Controller
class CategoryController {
  constructor(listCategories, createCategory) {
    this.listCategories = listCategories;
    this.createCategory = createCategory;
  }

  async list(req, res) {
    const result = await this.listCategories.execute();
    return res.json(result.categories);
  }

  async create(req, res) {
    const result = await this.createCategory.execute(req.body);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    
    // Log da criação da categoria com o usuário que realizou a ação
    logCreate(req, 'CATEGORY', req.body.name, { categoryId: result.category?.id });
    
    return res.status(201).json(result);
  }
}

module.exports = CategoryController;
