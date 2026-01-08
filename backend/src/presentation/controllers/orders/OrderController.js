// Order Controller
const CreateOrder = require('../../../application/usecases/orders/CreateOrder');
const ListUserOrders = require('../../../application/usecases/orders/ListUserOrders');
const GetOrderByTracking = require('../../../application/usecases/orders/GetOrderByTracking');
const GetOrderDetails = require('../../../application/usecases/orders/GetOrderDetails');
const UpdateOrderStatus = require('../../../application/usecases/orders/UpdateOrderStatus');
const UpdateOrderTracking = require('../../../application/usecases/orders/UpdateOrderTracking');
const ListAllOrders = require('../../../application/usecases/orders/ListAllOrders');

class OrderController {
  constructor(orderRepository) {
    this.createOrder = new CreateOrder(orderRepository);
    this.listUserOrders = new ListUserOrders(orderRepository);
    this.getOrderByTracking = new GetOrderByTracking(orderRepository);
    this.getOrderDetails = new GetOrderDetails(orderRepository);
    this.updateOrderStatus = new UpdateOrderStatus(orderRepository);
    this.updateOrderTracking = new UpdateOrderTracking(orderRepository);
    this.listAllOrders = new ListAllOrders(orderRepository);
  }

  // Criar novo pedido
  async create(req, res) {
    try {
      const { userId, items, shippingAddress } = req.body;

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: 'userId e items são obrigatórios' });
      }

      const order = await this.createOrder.execute({ userId, items, shippingAddress });
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Listar pedidos do usuário logado
  async getUserOrders(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID é obrigatório' });
      }

      const orders = await this.listUserOrders.execute(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error listing user orders:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar pedido por tracking code (público)
  async getByTracking(req, res) {
    try {
      const { trackingCode } = req.params;

      const order = await this.getOrderByTracking.execute(trackingCode);

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado com este código de rastreio' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error getting order by tracking:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar detalhes de um pedido específico
  async getDetails(req, res) {
    try {
      const { orderId } = req.params;

      const order = await this.getOrderDetails.execute(parseInt(orderId));

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Verificar se o pedido pertence ao usuário (se não for admin)
      if (req.user && !req.user.isAdmin && order.userId !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error getting order details:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar status do pedido (admin)
  async updateStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await this.updateOrderStatus.execute(parseInt(orderId), status);
      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar tracking do pedido (admin)
  async updateTracking(req, res) {
    try {
      const { orderId } = req.params;
      const { trackingCode, trackingStatus } = req.body;

      const order = await this.updateOrderTracking.execute(parseInt(orderId), {
        trackingCode,
        trackingStatus
      });
      res.json(order);
    } catch (error) {
      console.error('Error updating order tracking:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Listar todos os pedidos (admin)
  async getAll(req, res) {
    try {
      const { status, limit, offset } = req.query;

      const orders = await this.listAllOrders.execute({
        status,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });
      res.json(orders);
    } catch (error) {
      console.error('Error listing all orders:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
