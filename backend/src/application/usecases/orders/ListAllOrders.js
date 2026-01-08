// List All Orders (Admin) Use Case
class ListAllOrders {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(options = {}) {
    try {
      const orders = await this.orderRepository.findAll(options);
      return orders.map(order => order.toResponse());
    } catch (error) {
      throw new Error(`Failed to list orders: ${error.message}`);
    }
  }
}

module.exports = ListAllOrders;
