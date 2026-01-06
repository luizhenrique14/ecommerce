// Product Entity
class Product {
  constructor({ id, name, description, price, image, images, category_id, stock, created_at, updated_at, category_name, category_slug, category_icon }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = parseFloat(price);
    this.image = image;
    this.images = images;
    this.categoryId = category_id;
    this.stock = stock || 0;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.category = category_name ? {
      name: category_name,
      slug: category_slug,
      icon: category_icon
    } : null;
  }

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      images: this.images,
      category_id: this.categoryId,
      stock: this.stock,
      category: this.category
    };
  }
}

module.exports = Product;
