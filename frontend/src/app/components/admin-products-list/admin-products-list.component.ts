import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService, Product } from '../../services/product.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './admin-products-list.component.html',
  styleUrl: './admin-products-list.component.scss'
})
export class AdminProductsListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];
  loading = false;

  constructor(
    private productService: ProductService,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadProducts();
        },
        error: (error) => {
          const message = error.error?.message || 'Erro ao excluir produto';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  goToCreateProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  goToCreateCategory(): void {
    this.router.navigate(['/admin/categories/new']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

