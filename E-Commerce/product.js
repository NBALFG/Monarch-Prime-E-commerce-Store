// Product page interactions

const selectFirst = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

// Cart badge update function
function updateCartBadge() {
  if (window.BRFCart) {
    window.BRFCart.updateCartBadge();
  } else {
    // Fallback if BRFCart is not available
    const badge = document.querySelector('.cart .badge');
    if (badge) {
      try {
        const cart = JSON.parse(localStorage.getItem('brf_cart_v1')) || [];
        const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        badge.textContent = String(count);
      } catch {
        badge.textContent = '0';
      }
    }
  }
}

function initializeGallery() {
  const thumbs = selectAll('.gallery .thumb');
  if (thumbs.length === 0) return;

  function setActiveByForId(forId) {
    const input = selectFirst(`#${CSS.escape(forId)}`);
    if (!input) return;
    input.checked = true;
    thumbs.forEach((label) => {
      const isActive = label.getAttribute('for') === forId;
      label.ariaSelected = String(isActive);
    });
  }

  thumbs.forEach((label) => {
    label.addEventListener('click', () => setActiveByForId(label.getAttribute('for')));
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveByForId(label.getAttribute('for'));
      }
    });
  });
}

function initializeVariantSelection() {
  const priceEl = selectFirst('.product__price');
  const optionsForm = selectFirst('.product__options');
  if (!priceEl || !optionsForm) return;

  const selectionSummaryId = 'selection-summary';
  let summary = selectFirst(`#${selectionSummaryId}`);
  if (!summary) {
    summary = document.createElement('p');
    summary.id = selectionSummaryId;
    summary.className = 'muted';
    optionsForm.appendChild(summary);
  }

  const basePrice = 25000; // Updated to Naira base price
  const colorAdjustments = new Map([
    ['color-1', 0],
    ['color-2', 1500],
    ['color-3', 2500],
  ]);
  const sizeAdjustments = new Map([
    ['size-s', -1000],
    ['size-m', 0],
    ['size-l', 1000],
    ['size-xl', 2000],
  ]);

  function currentSelection() {
    const colorInput = selectFirst('.swatches input:checked');
    const sizeInput = selectFirst('.sizes input:checked');
    const colorLabel = colorInput ? selectFirst(`label[for="${CSS.escape(colorInput.id)}"]`) : null;
    const sizeLabel = sizeInput ? selectFirst(`label[for="${CSS.escape(sizeInput.id)}"]`) : null;
    const colorName = colorLabel ? colorLabel.getAttribute('aria-label') || 'Color' : 'Color';
    const sizeName = sizeLabel ? sizeLabel.textContent?.trim() || 'Size' : 'Size';

    const price = basePrice + (colorAdjustments.get(colorInput?.id || '') || 0) + (sizeAdjustments.get(sizeInput?.id || '') || 0);
    return { colorId: colorInput?.id, colorName, sizeId: sizeInput?.id, sizeName, price };
  }

  function updateUI() {
    const sel = currentSelection();
    priceEl.textContent = formatCurrency(sel.price);
    summary.textContent = `Selected: ${sel.colorName} • ${sel.sizeName}`;
  }

  optionsForm.addEventListener('change', (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    updateUI();
  });

  updateUI();
}

function initializeTabs() {
  const header = selectFirst('.tabs__header');
  if (!header) return;

  const ids = {
    details: 'tab-details',
    reviews: 'tab-reviews',
    discussion: 'tab-discussion',
  };

  function checkRadio(id) {
    const input = selectFirst(`#${CSS.escape(id)}`);
    if (input) input.checked = true;
  }

  function setHashFor(id) {
    const entry = Object.entries(ids).find(([, radioId]) => radioId === id);
    if (entry) {
      const [hash] = entry;
      history.replaceState(null, '', `#${hash}`);
    }
  }

  header.addEventListener('click', (e) => {
    const label = e.target.closest('label');
    if (!label) return;
    const forId = label.getAttribute('for');
    if (!forId) return;
    checkRadio(forId);
    setHashFor(forId);
  });

  const initialHash = location.hash.replace('#', '');
  if (initialHash && ids[initialHash]) {
    checkRadio(ids[initialHash]);
  }
}

function initializeQuantityControls() {
  const qtyInput = selectFirst('#qty');
  const decBtn = selectFirst('.qty-btn[data-action="decrement"]');
  const incBtn = selectFirst('.qty-btn[data-action="increment"]');
  
  if (!qtyInput || !decBtn || !incBtn) return;

  function updateQuantity(newValue) {
    const clampedValue = Math.max(1, parseInt(newValue, 10) || 1);
    qtyInput.value = String(clampedValue);
    return clampedValue;
  }

  // Decrement button
  decBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentValue = parseInt(qtyInput.value, 10) || 1;
    updateQuantity(currentValue - 1);
  });

  // Increment button
  incBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentValue = parseInt(qtyInput.value, 10) || 1;
    updateQuantity(currentValue + 1);
  });

  // Input validation
  qtyInput.addEventListener('input', (e) => {
    updateQuantity(e.target.value);
  });

  // Prevent form submission on Enter
  qtyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
}

function initializeAddToCart() {
  const form = selectFirst('.product__options');
  const addButton = selectFirst('#add-to-cart');
  if (!form || !addButton) return;

  addButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const title = selectFirst('.product__title')?.textContent?.trim() || 'Product';
    const qtyInput = selectFirst('#qty');
    const quantity = Math.max(1, parseInt(qtyInput?.value || '1', 10) || 1);
    
    const { colorId, colorName, sizeId, sizeName, price } = (function() {
      const colorInput = selectFirst('.swatches input:checked');
      const sizeInput = selectFirst('.sizes input:checked');
      const colorLabel = colorInput ? selectFirst(`label[for="${CSS.escape(colorInput.id)}"]`) : null;
      const sizeLabel = sizeInput ? selectFirst(`label[for="${CSS.escape(sizeInput.id)}"]`) : null;
      return {
        colorId: colorInput?.id,
        colorName: colorLabel?.getAttribute('aria-label') || 'Color',
        sizeId: sizeInput?.id,
        sizeName: sizeLabel?.textContent?.trim() || 'Size',
        price: parseFloat(selectFirst('.product__price')?.textContent?.replace(/[^\d.]/g, '') || '0') || 0,
      };
    })();

    const productId = title.toLowerCase().replace(/\s+/g, '-');
    const sku = window.BRFCart ? window.BRFCart.makeSku(productId, colorId, sizeId) : `${productId}::${colorId}::${sizeId}`;
    const primaryImage = selectFirst('.gallery__stage img')?.getAttribute('src') || '';
    const item = { sku, id: productId, title, price, image: primaryImage, quantity, attributes: { colorId, colorName, sizeId, sizeName } };

    if (window.BRFCart) {
      window.BRFCart.addItem(item);
    } else {
      // Fallback cart logic
      try {
        const cart = JSON.parse(localStorage.getItem('brf_cart_v1')) || [];
        const existingIndex = cart.findIndex(x => x.sku === item.sku);
        if (existingIndex >= 0) {
          cart[existingIndex].quantity += item.quantity;
        } else {
          cart.push(item);
        }
        localStorage.setItem('brf_cart_v1', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to add item to cart:', error);
      }
    }
    
    updateCartBadge();
    
    // Visual feedback
    addButton.disabled = true;
    addButton.textContent = 'Added';
    setTimeout(() => { 
      addButton.disabled = false; 
      addButton.textContent = 'Add to cart'; 
    }, 800);
  });
}

function initialize() {
  initializeGallery();
  initializeVariantSelection();
  initializeTabs();
  initializeQuantityControls();
  initializeAddToCart();
  updateCartBadge(); // Update cart badge on page load
}

// Wait for DOM and ensure cart utilities are loaded
function waitForCartUtils() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // If DOM is already loaded, wait a bit for cart utils
    setTimeout(initialize, 100);
  }
}

waitForCartUtils();


