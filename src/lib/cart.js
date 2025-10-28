// Simple client-side cart helper using localStorage
// Not for production — replace with real cart/store logic later.

const CART_KEY = "local_cart_v1";

export function getCart() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch (e) {
    console.error("getCart error", e);
    return { items: [] };
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("saveCart error", e);
  }
}

export function addToCart(product, qty = 1) {
  if (typeof window === "undefined") return null;
  const cart = getCart();
  const existing = cart.items.find((it) => it.id === product.id);
  if (existing) {
    existing.qty = Math.min((existing.qty || 0) + qty, product.inventory || 999);
  } else {
    cart.items.push({ id: product.id, name: product.name, price: product.price, qty: Math.min(qty, product.inventory || 999) });
  }
  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}
