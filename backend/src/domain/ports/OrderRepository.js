// Order Repository Port (Interface)
class OrderRepository {
  async create(orderData) {
    throw new Error('Method create must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method findByUserId must be implemented');
  }

  async findByTrackingCode(trackingCode) {
    throw new Error('Method findByTrackingCode must be implemented');
  }

  async addItem(orderId, itemData) {
    throw new Error('Method addItem must be implemented');
  }

  async getItems(orderId) {
    throw new Error('Method getItems must be implemented');
  }

  async updateStatus(orderId, status) {
    throw new Error('Method updateStatus must be implemented');
  }

  async updateTracking(orderId, trackingCode, trackingStatus) {
    throw new Error('Method updateTracking must be implemented');
  }

  async findAll(options = {}) {
    throw new Error('Method findAll must be implemented');
  }
}

module.exports = OrderRepository;
