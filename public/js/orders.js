// orders.js — Handles the orders page

function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            const orders = data.orders;
            if (!orders || orders.length === 0) {
                container.innerHTML = '<h1>Nothing there!</h1>';
                return;
            }

            let html = '<ul class="orders">';
            orders.forEach(order => {
                html += `
          <li class="orders__item">
            <h1>Order - # ${order._id}</h1>
            <ul class="orders__products">
        `;
                order.products.forEach(item => {
                    html += `<li class="orders__products-item">${item.product.title} (${item.quantity})</li>`;
                });
                html += `
            </ul>
          </li>
        `;
            });
            html += '</ul>';
            container.innerHTML = html;
        })
        .catch(err => console.log(err));
}

// Load orders on page load
loadOrders();
