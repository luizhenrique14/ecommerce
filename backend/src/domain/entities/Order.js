// Order Entity
class Order {
  constructor({ id, user_id, total_amount, status, tracking_code, tracking_status, shipping_address, created_at, updated_at, items, user_name, user_email, items_summary }) {
    this.id = id;
    this.userId = user_id;
    this.totalAmount = parseFloat(total_amount);
    this.status = status;
    this.trackingCode = tracking_code;
    this.trackingStatus = tracking_status;
    this.shippingAddress = shipping_address;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.items = items || [];
    this.userName = user_name;
    this.userEmail = user_email;
    this.itemsSummary = items_summary;
  }

  toResponse() {
    return {
      id: this.id,
      userId: this.userId,
      totalAmount: this.totalAmount,
      status: this.status,
      trackingCode: this.trackingCode,
      trackingStatus: this.trackingStatus,
      shippingAddress: this.shippingAddress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      items: this.items.map(item => item.toResponse ? item.toResponse() : item)
    };
  }

  toListResponse() {
    return {
      id: this.id,
      trackingCode: this.trackingCode,
      status: this.status,
      trackingStatus: this.trackingStatus,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      itemsCount: this.items?.length || 0
    };
  }
}

// OrderItem Entity
class OrderItem {
  constructor({ id, order_id, product_id, quantity, unit_price, product_name, product_image }) {
    this.id = id;
    this.orderId = order_id;
    this.productId = product_id;
    this.quantity = quantity;
    this.unitPrice = parseFloat(unit_price);
    this.productName = product_name;
    this.productImage = product_image;
  }

  toResponse() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      productImage: this.productImage,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      subtotal: this.quantity * this.unitPrice
    };
  }
}

module.exports = { Order, OrderItem };
