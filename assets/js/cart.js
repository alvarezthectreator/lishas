(() => {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (!link || !/lishashandmadecreations\.co\.uk\/cart\//.test(link.href)) return;
    event.preventDefault();
    const pageFolders = ['/shop/', '/about-us/', '/contact-us/', '/how-it-works/', '/product-category/', '/product/', '/cart/'];
    const folderIndex = pageFolders.reduce((found, folder) => Math.max(found, location.pathname.indexOf(folder)), -1);
    const projectRoot = folderIndex >= 0 ? location.pathname.slice(0, folderIndex) + '/' : location.pathname.replace(/[^/]*$/, '');
    location.href = projectRoot + 'cart/index.html';
  }, true);

  const storageKey = 'lishas-cart';
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch (error) { return []; }
  };
  const writeCart = (cart) => localStorage.setItem(storageKey, JSON.stringify(cart));
  const itemCount = (cart) => cart.reduce((total, item) => total + item.quantity, 0);

  const updateBadges = () => {
    const count = itemCount(readCart());
    document.querySelectorAll('.cart-count, .lhc-cart-count, .count').forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
    });
  };

  const addToCart = (item, quantity) => {
    const cart = readCart();
    const existing = cart.find((entry) => entry.id === item.id);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...item, quantity });
    writeCart(cart);
    updateBadges();
    return cart;
  };

  const getQuantity = (control) => {
    const input = control?.querySelector('input');
    const value = Number.parseInt(input?.value, 10);
    return Number.isFinite(value) && value > 0 ? value : 1;
  };

  document.addEventListener('click', (event) => {
    const quantityButton = event.target.closest('.qty button');
    if (quantityButton) {
      const input = quantityButton.parentElement.querySelector('input');
      const current = Number.parseInt(input.value, 10) || 1;
      input.value = Math.max(1, current + (quantityButton.textContent.trim() === '+' ? 1 : -1));
      return;
    }

    const addButton = event.target.closest('.add-btn, [data-add-to-cart]');
    if (!addButton) return;
    event.preventDefault();
    const item = {
      id: addButton.dataset.id || document.querySelector('h1')?.textContent.trim() || 'handmade-item',
      name: addButton.dataset.name || document.querySelector('h1')?.textContent.trim() || 'Handmade item',
      price: Number.parseFloat(addButton.dataset.price || document.querySelector('.price')?.textContent.replace(/[^0-9.]/g, '')) || 0,
      image: addButton.dataset.image || document.querySelector('.product-visual img')?.src || ''
    };
    addToCart(item, getQuantity(document.querySelector('.qty')));
    addButton.textContent = 'Added to cart';
    window.setTimeout(() => { addButton.textContent = 'Add to cart'; }, 1400);
  });

  window.LishasCart = { readCart, writeCart, addToCart, itemCount, updateBadges };
  updateBadges();
})();
