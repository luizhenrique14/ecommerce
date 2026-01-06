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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { Category } from '../../models/product.model';

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
  cartItemsCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    public router: Router,
    public authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkAdminStatus();
    this.subscribeToCart();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }

  private checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  private subscribeToCart(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItem[]) => {
        this.cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkAdminStatus();
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
