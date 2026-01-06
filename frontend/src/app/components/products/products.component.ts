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
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { ProductService } from '../../services/product.service';
import { Product, SortOption, ProductParams } from '../../models/product.model';
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
    ProductCardComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItemsCount = 0;
  loading = false;
  private destroy$ = new Subject<void>();

  // Pagination
  page = 1;
  pageSize = 12;
  totalProducts = 0;

  // Filters
  selectedCategory: number | null = null;
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItem[]) => {
        this.cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.selectedCategory = params['category'] ? parseInt(params['category']) : null;
        this.page = 1;
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  onSortChange(): void {
    const option = this.sortOptions.find(opt => opt.value === this.selectedSort);
    if (option) {
      this.sortBy = option.sort;
      this.sortOrder = option.order;
      this.page = 1;
      this.loadProducts();
    }
  }

  openProductDetail(product: Product): void {
    this.dialog.open(ProductDetailComponent, {
      width: '90%',
      maxWidth: '900px',
      data: { product },
      panelClass: 'product-detail-dialog-container'
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  goToCart(): void {
    this.router.navigate(['/checkout']);
  }

  get pageTitle(): string {
    return this.selectedCategory ? 'Produtos da Categoria' : 'Todos os Produtos';
  }
}
