import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

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
    const images = this.product.images && this.product.images.length > 0 
      ? this.product.images 
      : (this.product.image ? [this.product.image] : []);
    this.images = images.map((img: string) => this.getImagePath(img));
  }

  private getImagePath(imagePath?: string): string {
    if (!imagePath) return '/assets/img/images.jpg';
    // Se já começa com /assets ou http, retornar como está
    if (imagePath.startsWith('/assets') || imagePath.startsWith('http')) {
      return imagePath;
    }
    // Se começa com assets (sem barra), adicionar barra
    if (imagePath.startsWith('assets/')) {
      return '/' + imagePath;
    }
    // Caso contrário, assumir que é apenas o nome do arquivo
    return `/assets/img/${imagePath}`;
  }

  formatPrice(price: any): string {
    const n = Number(price);
    if (isNaN(n)) return '0.00';
    return n.toFixed(2);
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

