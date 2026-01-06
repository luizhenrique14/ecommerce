export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
