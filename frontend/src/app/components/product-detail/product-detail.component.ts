import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  currentImageIndex = 0;
  images: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private cartService: CartService
  ) {
    this.product = data.product;
  }

  ngOnInit(): void {
    this.images = this.product.images && this.product.images.length > 0 
      ? this.product.images 
      : (this.product.image ? [this.product.image] : []);
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  }

  previousImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}

