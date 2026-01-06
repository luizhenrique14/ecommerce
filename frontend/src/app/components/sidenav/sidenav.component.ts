import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService, Category } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() categorySelected = new EventEmitter<number | null>();
  categories: Category[] = [];
  isAdmin = false;
  cartItemsCount: number = 0;
  private routerSubscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    public router: Router,
    public authService: AuthService,
    private cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.checkAdminStatus();
    
    // Subscribe to cart items
    this.cartSubscription = this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItemsCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    });
    
    // Listen to route changes to update admin status
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAdminStatus();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
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

  goHome(): void {
    this.router.navigate(['/products'], { queryParams: {} });
    this.categorySelected.emit(null);
  }

  selectCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
    this.categorySelected.emit(categoryId);
  }

  goToCart(): void {
    this.router.navigate(['/checkout']);
  }
}

