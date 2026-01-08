// Get Order By Tracking Code Use Case
class GetOrderByTracking {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(trackingCode) {
    try {
      const order = await this.orderRepository.getOrderWithItemsByTracking(trackingCode);
      
      if (!order) {
        return null;
      }

      return order.toResponse();
    } catch (error) {
      throw new Error(`Failed to get order by tracking: ${error.message}`);
    }
  }
}

module.exports = GetOrderByTracking;
