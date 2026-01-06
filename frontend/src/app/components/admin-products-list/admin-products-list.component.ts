import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductService, Product, Category } from '../../services/product.service';
import { AdminService } from '../../services/admin.service';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  templateUrl: './admin-products-list.component.html',
  styleUrl: './admin-products-list.component.scss'
})
export class AdminProductsListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  loading = false;

  // Filtros
  searchControl = new FormControl('');
  categoryFilterControl = new FormControl<number | null>(null);
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.setupFilters();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  setupFilters(): void {
    // Filtro de busca por nome
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    ).subscribe(searchTerm => {
      this.applyFilters();
    });

    // Filtro por categoria
    this.categoryFilterControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Filtro por categoria
    const categoryId = this.categoryFilterControl.value;
    if (categoryId) {
      filtered = filtered.filter(p => p.category_id === categoryId);
    }

    // Filtro por nome (busca)
    const searchTerm = this.searchControl.value?.toLowerCase().trim() || '';
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Atualizar produtos e dataSource
    this.products = filtered.map(product => ({
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      stock: typeof product.stock === 'string' ? parseInt(product.stock) : (product.stock || 0)
    }));
    this.dataSource.data = this.products;
    this.filteredProducts = this.products;
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        // Guardar todos os produtos originais
        this.allProducts = response.products;
        // Aplicar filtros
        this.applyFilters();
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

  // Autocomplete - filtrar produtos por nome
  filterProductsByName(value: string | null): Product[] {
    if (!value || value.trim() === '') {
      return [];
    }
    const filterValue = value.toLowerCase().trim();
    return this.allProducts.filter(product => 
      product.name.toLowerCase().includes(filterValue)
    ).slice(0, 10); // Limitar a 10 resultados
  }

  displayProductName(product: Product | string | null): string {
    if (!product) return '';
    if (typeof product === 'string') {
      return product;
    }
    return product.name || '';
  }

  onProductSelected(product: Product): void {
    // Quando selecionar um produto no autocomplete, usar o nome para filtrar
    if (product && product.name) {
      this.searchControl.setValue(product.name);
      this.applyFilters();
    }
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryFilterControl.setValue(null);
    this.applyFilters();
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

  formatPrice(price: any): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0.00';
    return numPrice.toFixed(2);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
