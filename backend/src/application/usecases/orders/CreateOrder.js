// Create Order Use Case

class CreateOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute({ userId, items, shippingAddress }) {
    try {
      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        totalAmount += item.unitPrice * item.quantity;
      }

      // Generate tracking code
      const trackingCode = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Create order
      const order = await this.orderRepository.create({
        userId,
        totalAmount,
        shippingAddress,
        trackingCode
      });

      // Add order items
      for (const item of items) {
        await this.orderRepository.addItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        });
      }

      // Return order with items
      return await this.orderRepository.getOrderWithItems(order.id);
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

module.exports = CreateOrder;
