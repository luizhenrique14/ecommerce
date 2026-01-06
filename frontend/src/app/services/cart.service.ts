import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.cartItems$.subscribe(items => {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    });
  }

  addToCart(product: Pick<CartItem, 'id' | 'name' | 'price' | 'image'>): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      this.cartItemsSubject.next([...currentItems, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.cartItemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.id === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
    }
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  private loadFromStorage(): CartItem[] {
    const cartStr = localStorage.getItem(this.CART_KEY);
    return cartStr ? JSON.parse(cartStr) : [];
  }
}
