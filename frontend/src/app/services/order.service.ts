import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(items: { productId: number; quantity: number; unitPrice: number }[], shippingAddress: string): Observable<Order> {
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    return this.http.post<Order>(`${this.apiUrl}/orders`, {
      userId: user.id,
      items,
      shippingAddress
    }, { headers: this.getHeaders() });
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`, { headers: this.getHeaders() });
  }

  trackOrder(trackingCode: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/track/${trackingCode}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status }, { headers: this.getHeaders() });
  }

  updateOrderTracking(orderId: number, trackingCode: string, trackingStatus: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/tracking`, { trackingCode, trackingStatus }, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`, { headers: this.getHeaders() });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#f44336',
      'processing': '#ff9800',
      'shipped': '#2196f3',
      'delivered': '#4caf50',
      'cancelled': '#9e9e9e'
    };
    return colors[status] || '#666';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendente',
      'processing': 'Em Processamento',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getTrackingStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Aguardando Envio',
      'processing': 'Em Processamento',
      'shipped': 'Enviado',
      'in_transit': 'Em Trânsito',
      'out_for_delivery': 'Saiu para Entrega',
      'delivered': 'Entregue'
    };
    return labels[status] || status;
  }
}
