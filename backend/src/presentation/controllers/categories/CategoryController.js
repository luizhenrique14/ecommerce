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
    return res.status(201).json(result);
  }
}

module.exports = CategoryController;
