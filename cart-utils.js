// Shared cart utilities for BR.F demo shop

const CART_KEY = 'brf_cart_v1';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCart() { return readCart(); }
function saveCart(cart) { writeCart(cart); updateCartBadge(); }

function getCartCount() {
  return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart .badge');
  if (badge) badge.textContent = String(getCartCount());
}

function computeTotals(cart = readCart()) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
}

function makeSku(productId, colorId, sizeId) {
  return [productId, colorId || 'na', sizeId || 'na'].join('::');
}

function addItem(item) {
  const cart = readCart();
  const index = cart.findIndex((x) => x.sku === item.sku);
  if (index >= 0) cart[index].quantity += item.quantity;
  else cart.push(item);
  saveCart(cart);
}

function removeItem(sku) {
  const cart = readCart().filter((x) => x.sku !== sku);
  saveCart(cart);
}

function updateQuantity(sku, quantity) {
  const cart = readCart();
  const target = cart.find((x) => x.sku === sku);
  if (!target) return;
  target.quantity = Math.max(1, quantity | 0);
  saveCart(cart);
}

window.BRFCart = {
  getCart, saveCart, getCartCount, updateCartBadge,
  computeTotals, makeSku, addItem, removeItem, updateQuantity,
};

document.addEventListener('DOMContentLoaded', updateCartBadge);


