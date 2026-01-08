// Get Order Details Use Case
class GetOrderDetails {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId) {
    try {
      const order = await this.orderRepository.getOrderWithItems(orderId);
      
      if (!order) {
        return null;
      }

      return order.toResponse();
    } catch (error) {
      throw new Error(`Failed to get order details: ${error.message}`);
    }
  }
}

module.exports = GetOrderDetails;
