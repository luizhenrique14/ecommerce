// List User Orders Use Case
class ListUserOrders {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(userId) {
    try {
      const orders = await this.orderRepository.getUserOrdersWithItems(userId);
      return orders.map(order => order.toListResponse());
    } catch (error) {
      throw new Error(`Failed to list user orders: ${error.message}`);
    }
  }
}

module.exports = ListUserOrders;
