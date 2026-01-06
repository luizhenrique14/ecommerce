import { Component, OnInit } from '@angular/core';
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
import { CartService, CartItem } from '../../services/cart.service';

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
    MatDividerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  
  shippingForm: FormGroup;
  paymentForm: FormGroup;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Load cached form data
    const cachedShipping = this.loadCachedFormData('checkout_shipping');
    const cachedPayment = this.loadCachedFormData('checkout_payment');

    this.shippingForm = this.fb.group({
      name: [cachedShipping.name || '', Validators.required],
      address: [cachedShipping.address || '', Validators.required],
      city: [cachedShipping.city || '', Validators.required],
      zipCode: [cachedShipping.zipCode || '', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      phone: [cachedShipping.phone || '', [Validators.required, Validators.pattern(/^\d{10,11}$/)]]
    });

    this.paymentForm = this.fb.group({
      cardNumber: [cachedPayment.cardNumber || '', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
      cardName: [cachedPayment.cardName || '', Validators.required],
      expiryDate: [cachedPayment.expiryDate || '', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: [cachedPayment.cvv || '', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

    // Save form data on changes
    this.shippingForm.valueChanges.subscribe(() => {
      this.saveCachedFormData('checkout_shipping', this.shippingForm.value);
    });

    this.paymentForm.valueChanges.subscribe(() => {
      this.saveCachedFormData('checkout_payment', this.paymentForm.value);
    });
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  private loadCachedFormData(key: string): any {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  }

  private saveCachedFormData(key: string, data: any): void {
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
      // Clear cached form data after successful payment
      localStorage.removeItem('checkout_shipping');
      localStorage.removeItem('checkout_payment');
      
      // Simular processamento de pagamento
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/success']);
      }, 1000);
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  formatPrice(price: any): string {
    const n = Number(price);
    if (isNaN(n)) return '0.00';
    return n.toFixed(2);
  }
}

