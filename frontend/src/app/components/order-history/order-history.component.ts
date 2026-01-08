import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  trackingCode = '';
  trackedOrder: Order | null = null;

  constructor(
    public orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.loading = false;
      }
    });
  }

  viewDetails(order: Order): void {
    this.router.navigate(['/order-details', order.id]);
  }

  trackOrder(trackingCode: string): void {
    this.trackingCode = trackingCode;
    this.trackByCode();
  }

  trackByCode(): void {
    if (!this.trackingCode) return;

    this.orderService.trackOrder(this.trackingCode).subscribe({
      next: (order) => {
        this.trackedOrder = order;
      },
      error: (error) => {
        console.error('Erro ao rastrear pedido:', error);
        alert('Pedido não encontrado com este código de rastreio');
        this.trackedOrder = null;
      }
    });
  }

  isStepActive(step: string, currentStatus: string): boolean {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const stepIndex = statusOrder.indexOf(step);
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex >= stepIndex && currentIndex >= 0;
  }
}
