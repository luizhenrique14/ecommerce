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
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService, Product } from '../../services/product.service';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItemsCount: number = 0;
  loading = false;
  private cartSubscription?: Subscription;

  // Pagination
  page = 1;
  pageSize = 12;
  totalProducts = 0;
  totalPages = 0;

  // Filters
  selectedCategory: number | null = null;
  sortBy = 'name';
  sortOrder = 'ASC';

  sortOptions = [
    { value: 'name-ASC', label: 'Nome (A-Z)', sort: 'name', order: 'ASC' },
    { value: 'name-DESC', label: 'Nome (Z-A)', sort: 'name', order: 'DESC' },
    { value: 'price-ASC', label: 'Preço (menor para maior)', sort: 'price', order: 'ASC' },
    { value: 'price-DESC', label: 'Preço (maior para menor)', sort: 'price', order: 'DESC' }
  ];
  selectedSort = 'name-ASC';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Subscribe to cart items
    this.cartSubscription = this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItemsCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    });

    // Check for category in query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = parseInt(params['category']);
      } else {
        this.selectedCategory = null;
      }
      this.page = 1;
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.loading = true;
    const params = {
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
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
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

  getProductImage(product: Product): string {
    let imgPath = '';
    
    if (product.images && product.images.length > 0) {
      imgPath = product.images[0];
    } else if (product.image) {
      imgPath = product.image;
    } else {
      return '/assets/img/images.jpg'; // Imagem padrão
    }
    
    return this.getImagePath(imgPath);
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
    
    // Se contém caminho completo do banco (com /assets/img/), usar como está mas garantir barra inicial
    if (imagePath.includes('/assets/img/')) {
      return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    }
    
    // Caso contrário, assumir que é apenas o nome do arquivo ou caminho relativo
    return `/assets/img/${imagePath}`;
  }

  formatPrice(price: any): string {
    const n = Number(price);
    if (isNaN(n)) return '0.00';
    return n.toFixed(2);
  }
}
