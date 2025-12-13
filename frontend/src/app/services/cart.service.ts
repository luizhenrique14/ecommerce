import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.cartItems$.subscribe((items: CartItem[]) => {
      localStorage.setItem('cart', JSON.stringify(items));
    });
  }

  addToCart(product: { id: number; name: string; price: number; image?: string }): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find((item: CartItem) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }

    this.cartItemsSubject.next([...currentItems]);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.cartItemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find((item: CartItem) => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...currentItems]);
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  private loadCartFromStorage(): CartItem[] {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
  }
}

