// Update Order Status Use Case
class UpdateOrderStatus {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, status) {
    try {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      await this.orderRepository.updateStatus(orderId, status);
      
      return await this.orderRepository.findById(orderId);
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }
}

module.exports = UpdateOrderStatus;
