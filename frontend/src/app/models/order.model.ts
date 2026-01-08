export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingCode: string;
  trackingStatus: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
