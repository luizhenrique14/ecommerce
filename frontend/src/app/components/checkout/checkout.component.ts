import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { formatPrice } from '../../shared/utils';
import { MaskDirective } from './mask.directive';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatListModule,
    MatDividerModule,
    MaskDirective
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  formatPrice = formatPrice;

  shippingForm: FormGroup;
  paymentForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const cachedShipping = this.loadCachedFormData<{name?: string; address?: string; city?: string; zipCode?: string; phone?: string}>('checkout_shipping');
    const cachedPayment = this.loadCachedFormData<{cardNumber?: string; cardName?: string; expiryDate?: string; cvv?: string}>('checkout_payment');

    this.shippingForm = this.fb.group({
      name: [cachedShipping.name || '', Validators.required],
      address: [cachedShipping.address || '', Validators.required],
      city: [cachedShipping.city || '', Validators.required],
      zipCode: [cachedShipping.zipCode || '', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      phone: [cachedShipping.phone || '', [Validators.required, Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/)]]
    });

    this.paymentForm = this.fb.group({
      cardNumber: [cachedPayment.cardNumber || '', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      cardName: [cachedPayment.cardName || '', Validators.required],
      expiryDate: [cachedPayment.expiryDate || '', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: [cachedPayment.cvv || '', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

    this.shippingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.saveCachedFormData('checkout_shipping', this.shippingForm.value));

    this.paymentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.saveCachedFormData('checkout_payment', this.paymentForm.value));
  }

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.totalPrice = this.cartService.getTotalPrice();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCachedFormData<T>(key: string): T {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : {} as T;
    } catch {
      return {} as T;
    }
  }

  private saveCachedFormData(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving form data to cache:', e);
    }
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    this.cartService.updateQuantity(item.id, newQuantity);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  finalizePayment(): void {
    if (this.shippingForm.valid && this.paymentForm.valid) {
      localStorage.removeItem('checkout_shipping');
      localStorage.removeItem('checkout_payment');
      
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/success']);
      }, 1000);
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
