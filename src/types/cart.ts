export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller?: string;
  specs?: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}