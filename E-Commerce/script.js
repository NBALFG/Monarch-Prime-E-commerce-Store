// Site-wide script to render catalog, product details, and sync cart badge

(function () {
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
  const fmt = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);
  const CART_KEY = 'brf_cart_v1';

  // --- Cart helpers (modular) -------------------------------------------------
  /** Read cart array from storage */
  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }
  /** Write cart array to storage */
  function writeCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  /** Update cart badge count in navbar */
  function updateCartCount() {
    if (window.BRFCart) { window.BRFCart.updateCartBadge(); return; }
    const badge = document.querySelector('.cart .badge');
    if (!badge) return;
    const count = readCart().reduce((s, it) => s + (it.quantity || 0), 0);
    badge.textContent = String(count);
  }

  /** Merge item into cart (increase quantity if SKU exists) */
  function addToCart(item) {
    // Prefer shared utils if available
    if (window.BRFCart) { window.BRFCart.addItem(item); updateCartCount(); return; }
    const cart = readCart();
    const idx = cart.findIndex((x) => x.sku === item.sku);
    if (idx >= 0) cart[idx].quantity += item.quantity; else cart.push(item);
    writeCart(cart);
    updateCartCount();
  }

  /** Optional hook to update local UI after cart actions */
  function updateCartUI() {
    updateCartCount();
  }

  // Routing helpers
  const params = new URLSearchParams(location.search);
  const productId = params.get('id');

  function renderCatalog() {
    const grid = $('#home-grid');
    if (!grid || !window.PRODUCTS) return;
    grid.innerHTML = '';
    window.PRODUCTS.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-card__media">
          <img src="${p.images[0].replace('/1200/900','/600/400')}" alt="${p.name}" loading="lazy" />
        </a>
        <div class="product-card__body">
          <h3 class="product-card__title"><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
          <p class="product-card__price">${fmt(p.price)}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    if (window.BRFCart) window.BRFCart.updateCartBadge();
  }

  function hydrateProductPage() {
    if (!productId || !window.PRODUCTS) return;
    const product = window.PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const title = $('.product__title');
    const price = $('.product__price');
    const galleryStage = $('.gallery__stage');
    const thumbs = $('.gallery__thumbs');
    if (title) title.textContent = product.name;
    if (price) price.textContent = fmt(product.price);

    if (galleryStage && product.images) {
      galleryStage.innerHTML = product.images
        .map((src, i) => `<figure class="gallery__item" data-for="slide-${i+1}"><img src="${src}" alt="${product.name} image ${i+1}" /></figure>`)
        .join('');
    }
    if (thumbs && product.images) {
      thumbs.innerHTML = product.images
        .map((src, i) => `<label class="thumb" for="slide-${i+1}"><img src="${src.replace('/1200/900','/200/150')}" alt="Thumbnail ${i+1}"/></label>`)
        .join('');
    }
  }

  // Enhance Add to Cart to include product from PRODUCTS if present
  function wireAddToCart() {
    const form = document.querySelector('.product__options');
    const button = document.querySelector('#add-to-cart');
    if (!form || !button) return;
    button.addEventListener('click', (e) => {
      if (!productId) return;
      const product = window.PRODUCTS?.find((p) => p.id === productId);
      if (!product) return;
      const qtyInput = $('#qty', form);
      const quantity = Math.max(1, parseInt(qtyInput?.value || '1', 10) || 1);
      const colorInput = document.querySelector('.swatches input:checked');
      const sizeInput = document.querySelector('.sizes input:checked');
      const sku = `${product.id}::${colorInput?.id || 'na'}::${sizeInput?.id || 'na'}`;
      const item = {
        sku,
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity,
        attributes: {
          colorId: colorInput?.id, colorName: document.querySelector(`label[for="${colorInput?.id}"]`)?.getAttribute('aria-label') || 'Color',
          sizeId: sizeInput?.id, sizeName: document.querySelector(`label[for="${sizeInput?.id}"]`)?.textContent?.trim() || 'Size',
        }
      };
      addToCart(item);
      updateCartUI();
    });
  }

  function init() {
    renderCatalog();
    hydrateProductPage();
    wireAddToCart();
    updateCartCount();
  }

  // Expose modular API
  window.addToCart = addToCart;
  window.updateCartCount = updateCartCount;
  window.updateCartUI = updateCartUI;

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

})();

