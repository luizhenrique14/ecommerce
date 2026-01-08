// Order Repository Adapter
const OrderRepository = require('../../domain/ports/OrderRepository');
const db = require('../database/pool');
const { Order, OrderItem } = require('../../domain/entities/Order');

class OrderRepositoryAdapter extends OrderRepository {
  async create({ userId, totalAmount, shippingAddress, trackingCode }) {
    const result = await db.execute(
      'INSERT INTO orders (user_id, total_amount, status, tracking_code, shipping_address) VALUES (?, ?, ?, ?, ?)',
      [userId, totalAmount, 'pending', trackingCode || null, shippingAddress]
    );
    return { id: result.insertId, userId, totalAmount, shippingAddress, trackingCode };
  }

  async findById(id) {
    const results = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (results.length === 0) return null;
    return new Order(results[0]);
  }

  async findByUserId(userId) {
    const results = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return results.map(row => new Order(row));
  }

  async findByTrackingCode(trackingCode) {
    const results = await db.query(
      'SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.tracking_code = ?',
      [trackingCode]
    );
    if (results.length === 0) return null;
    return new Order(results[0]);
  }

  async addItem({ orderId, productId, quantity, unitPrice }) {
    const result = await db.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, unitPrice]
    );
    return { id: result.insertId, orderId, productId, quantity, unitPrice };
  }

  async getItems(orderId) {
    const results = await db.query(
      'SELECT oi.*, p.name as product_name, p.image as product_image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [orderId]
    );
    return results.map(row => new OrderItem(row));
  }

  async updateStatus(orderId, status) {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  }

  async updateTracking(orderId, trackingCode, trackingStatus) {
    const statusMap = {
      'shipped': 'shipped',
      'delivered': 'delivered',
      'in_transit': 'shipped',
      'out_for_delivery': 'shipped',
      'delivered': 'delivered'
    };
    const newStatus = statusMap[trackingStatus] || 'processing';
    
    await db.execute(
      'UPDATE orders SET tracking_code = ?, tracking_status = ?, status = ? WHERE id = ?',
      [trackingCode, trackingStatus, newStatus, orderId]
    );
  }

  async findAll(options = {}) {
    const { limit = 50, offset = 0, status } = options;
    let query = 'SELECT * FROM orders';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const results = await db.query(query, params);
    return results.map(row => new Order(row));
  }

  async getOrderWithItems(orderId) {
    const order = await this.findById(orderId);
    if (!order) return null;
    
    const items = await this.getItems(orderId);
    order.items = items;
    return order;
  }

  async getOrderWithItemsByTracking(trackingCode) {
    const order = await this.findByTrackingCode(trackingCode);
    if (!order) return null;
    
    const items = await this.getItems(order.id);
    order.items = items;
    return order;
  }

  async getUserOrdersWithItems(userId) {
    const orders = await this.findByUserId(userId);
    for (const order of orders) {
      order.items = await this.getItems(order.id);
    }
    return orders;
  }
}

module.exports = OrderRepositoryAdapter;
