// shop.js — Handles product listing and product detail pages

// Helper: Create a product card HTML
function createProductCard(product, showDetails = true) {
    const card = document.createElement('article');
    card.className = 'card product-item';

    card.innerHTML = `
    <header class="card__header">
      <h1 class="product__title">${product.title}</h1>
    </header>
    <div class="card__image">
      <img src="${product.imageUrl}" alt="${product.title}">
    </div>
    <div class="card__content">
      <h2 class="product__price">$${product.price}</h2>
      <p class="product__description">${product.description}</p>
    </div>
    <div class="card__actions">
      ${showDetails ? `<a href="/product-detail.html?id=${product._id}" class="btn">Details</a>` : ''}
      <button class="btn" onclick="addToCart('${product._id}')">Add to Cart</button>
    </div>
  `;
    return card;
}

// Add product to cart
function addToCart(productId) {
    fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.log(err));
}

// Load products for index.html and products.html
function loadProducts() {
    const productList = document.getElementById('product-list');
    const noProducts = document.getElementById('no-products');
    if (!productList) return;

    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            const products = data.products;
            if (products.length === 0) {
                noProducts.style.display = 'block';
                return;
            }
            products.forEach(product => {
                productList.appendChild(createProductCard(product));
            });
        })
        .catch(err => console.log(err));
}

// Load single product for product-detail.html
function loadProductDetail() {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        container.innerHTML = '<h1>Product not found!</h1>';
        return;
    }

    fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            const product = data.product;
            if (!product) {
                container.innerHTML = '<h1>Product not found!</h1>';
                return;
            }
            document.title = product.title;
            container.innerHTML = `
        <h1>${product.title}</h1>
        <hr>
        <div class="image">
          <img src="${product.imageUrl}" alt="${product.title}">
        </div>
        <h2>$${product.price}</h2>
        <p>${product.description}</p>
        <button class="btn" onclick="addToCart('${product._id}')">Add to Cart</button>
      `;
        })
        .catch(err => console.log(err));
}

// Auto-detect which page we're on and load accordingly
if (document.getElementById('product-list')) {
    loadProducts();
} else if (document.getElementById('product-detail')) {
    loadProductDetail();
}
