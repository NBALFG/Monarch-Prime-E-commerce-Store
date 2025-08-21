// Cart page rendering and interactions

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

function renderCart() {
  const list = document.querySelector('.cart-list');
  const summarySubtotal = document.querySelector('.subtotal');
  const summaryTotal = document.querySelector('.total');
  const checkoutBtn = document.querySelector('.summary-card .btn');
  if (!list) return;

  const cart = window.BRFCart.getCart();
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = '<p class="muted">Your cart is empty.</p>';
    summarySubtotal.textContent = formatCurrency(0);
    summaryTotal.textContent = formatCurrency(0);
    checkoutBtn.disabled = true;
    window.BRFCart.updateCartBadge();
    return;
  }

  checkoutBtn.disabled = false;

  cart.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h3>${item.title}</h3>
        <div class="muted">${item.attributes?.colorName || ''} • ${item.attributes?.sizeName || ''}</div>
        <div class="qty" aria-label="Quantity">
          <label class="sr-only" for="qty-${item.sku}">Quantity</label>
          <input id="qty-${item.sku}" type="number" min="0" value="${item.quantity}" />
        </div>
      </div>
      <div style="text-align:right; display:grid; gap:.5rem; align-content:start;">
        <div class="price">${formatCurrency(item.price * item.quantity)}</div>
        <button class="btn btn--outline remove" data-sku="${item.sku}">Remove</button>
      </div>
    `;

    list.appendChild(row);

    row.querySelector('input').addEventListener('change', (e) => {
      const next = parseInt(e.target.value, 10);
      if (!Number.isFinite(next) || next < 0) { e.target.value = String(item.quantity); return; }
      if (next === 0) {
        window.BRFCart.removeItem(item.sku);
      } else {
        window.BRFCart.updateQuantity(item.sku, next);
      }
      renderCart();
    });
    row.querySelector('.remove').addEventListener('click', () => {
      window.BRFCart.removeItem(item.sku);
      renderCart();
    });
  });

  const totals = window.BRFCart.computeTotals(cart);
  summarySubtotal.textContent = formatCurrency(totals.subtotal);
  summaryTotal.textContent = formatCurrency(totals.subtotal); // no tax/shipping in demo
  window.BRFCart.updateCartBadge();
}

document.addEventListener('DOMContentLoaded', renderCart);


