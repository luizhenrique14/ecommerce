import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { ProductService } from '../../services/product.service';
import { Product, SortOption, ProductParams, Category } from '../../models/product.model';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductCardComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItemsCount = 0;
  loading = false;
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  // Pagination
  page = 1;
  pageSize = 12;
  totalProducts = 0;

  // Filters
  selectedCategory: number | null = null;
  selectedCategoryName = 'Todos os Produtos';
  sortBy = 'name';
  sortOrder: 'ASC' | 'DESC' = 'ASC';

  sortOptions: SortOption[] = [
    { value: 'name-ASC', label: 'Nome (A-Z)', sort: 'name', order: 'ASC' },
    { value: 'name-DESC', label: 'Nome (Z-A)', sort: 'name', order: 'DESC' },
    { value: 'price-ASC', label: 'Preço (menor para maior)', sort: 'price', order: 'ASC' },
    { value: 'price-DESC', label: 'Preço (maior para menor)', sort: 'price', order: 'DESC' }
  ];
  selectedSort = 'name-ASC';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItem[]) => {
        this.cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });

    this.cartService.lastActionResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.showNotification(result.message, result.success ? 'success-snackbar' : 'error-snackbar');
        }
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.selectedCategory = params['category'] ? parseInt(params['category']) : null;
        this.updateCategoryName();
        
        // Read pagination/sorting from URL
        this.page = params['page'] ? parseInt(params['page']) : 1;
        this.pageSize = params['limit'] ? parseInt(params['limit']) : 12;
        
        const sortParam = params['sort'];
        const orderParam = params['order'];
        if (sortParam && orderParam) {
          this.sortBy = sortParam;
          this.sortOrder = orderParam;
          // Update selectedSort
          const option = this.sortOptions.find(opt => opt.sort === sortParam && opt.order === orderParam);
          if (option) {
            this.selectedSort = option.value;
          }
        }
        
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.updateCategoryName();
      }
    });
  }

  private updateCategoryName(): void {
    if (this.selectedCategory) {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      this.selectedCategoryName = category ? category.name : 'Produtos da Categoria';
    } else {
      this.selectedCategoryName = 'Todos os Produtos';
    }
  }

  loadProducts(): void {
    this.loading = true;
    const params: ProductParams = {
      category: this.selectedCategory || undefined,
      page: this.page,
      limit: this.pageSize,
      sort: this.sortBy,
      order: this.sortOrder
    };

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalProducts = response.pagination.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updateUrlParams();
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  onSortChange(): void {
    const option = this.sortOptions.find(opt => opt.value === this.selectedSort);
    if (option) {
      this.sortBy = option.sort;
      this.sortOrder = option.order;
      this.page = 1;
      this.updateUrlParams();
      this.loadProducts();
    }
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }
    if (this.page > 1) {
      queryParams.page = this.page;
    }
    if (this.pageSize !== 12) {
      queryParams.limit = this.pageSize;
    }
    if (this.sortBy !== 'name' || this.sortOrder !== 'ASC') {
      queryParams.sort = this.sortBy;
      queryParams.order = this.sortOrder;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  openProductDetail(product: Product): void {
    this.dialog.open(ProductDetailComponent, {
      width: '90%',
      maxWidth: '900px',
      data: { product },
      panelClass: 'product-detail-dialog-container'
    });
  }

  addToCart(data: { product: Product; quantity: number }): void {
    this.cartService.addToCart(data.product, data.quantity).subscribe();
  }

  goToCart(): void {
    this.router.navigate(['/checkout']);
  }

  private showNotification(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  get pageTitle(): string {
    return this.selectedCategoryName;
  }
}
