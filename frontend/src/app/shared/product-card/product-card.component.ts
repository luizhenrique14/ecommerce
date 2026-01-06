import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { formatPrice, getProductImage } from '../utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showOverlay = true;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();
  @Output() viewDetails = new EventEmitter<Product>();

  quantity = 1;
  showQuantityInput = false;

  formatPrice = formatPrice;
  getProductImage = getProductImage;

  onCardClick(): void {
    if (!this.showQuantityInput) {
      this.viewDetails.emit(this.product);
    }
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    if (!this.showQuantityInput) {
      this.showQuantityInput = true;
    } else {
      this.addToCart.emit({ product: this.product, quantity: this.quantity });
      this.showQuantityInput = false;
      this.quantity = 1;
    }
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.product);
  }

  cancelQuantity(event: Event): void {
    event.stopPropagation();
    this.showQuantityInput = false;
    this.quantity = 1;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (this.quantity < 1 || !this.quantity) {
      this.quantity = 1;
    }
  }
}
