// cart.js — Handles the cart page

// Load cart items
function loadCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;

    fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
            const products = data.products;
            if (!products || products.length === 0) {
                container.innerHTML = '<h1>No Products in Cart!</h1>';
                return;
            }

            let html = '<ul class="cart__item-list">';
            products.forEach(p => {
                html += `
          <li class="cart__item">
            <h1>${p.productId.title}</h1>
            <h2>Quantity: ${p.quantity}</h2>
            <button class="btn danger" onclick="deleteCartItem('${p.productId._id}')">Delete</button>
          </li>
        `;
            });
            html += '</ul>';
            html += `
        <hr>
        <div class="centered">
          <button class="btn" onclick="placeOrder()">Order Now!</button>
        </div>
      `;
            container.innerHTML = html;
        })
        .catch(err => console.log(err));
}

// Delete item from cart
function deleteCartItem(productId) {
    fetch('/api/cart-delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
    })
        .then(res => res.json())
        .then(data => {
            // Reload cart after deletion
            loadCart();
        })
        .catch(err => console.log(err));
}

// Place order
function placeOrder() {
    fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            window.location.href = '/orders.html';
        })
        .catch(err => console.log(err));
}

// Load cart on page load
loadCart();
