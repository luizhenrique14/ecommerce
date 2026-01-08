// Update Order Tracking Use Case
class UpdateOrderTracking {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, { trackingCode, trackingStatus }) {
    try {
      await this.orderRepository.updateTracking(orderId, trackingCode, trackingStatus);
      
      return await this.orderRepository.getOrderWithItems(orderId);
    } catch (error) {
      throw new Error(`Failed to update order tracking: ${error.message}`);
    }
  }
}

module.exports = UpdateOrderTracking;
