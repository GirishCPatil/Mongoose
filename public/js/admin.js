// admin.js — Handles admin pages (add product, edit product, admin product list)

// Add Product Form
const addForm = document.getElementById('add-product-form');
if (addForm) {
    addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;

        fetch('/admin/add-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, imageUrl, price, description })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                window.location.href = '/admin/products.html';
            })
            .catch(err => console.log(err));
    });
}

// Edit Product Form — load existing product data
const editForm = document.getElementById('edit-product-form');
if (editForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetch(`/admin/edit-product/${productId}`)
            .then(res => res.json())
            .then(data => {
                const product = data.product;
                document.getElementById('title').value = product.title;
                document.getElementById('imageUrl').value = product.imageUrl;
                document.getElementById('price').value = product.price;
                document.getElementById('description').value = product.description;
                document.getElementById('productId').value = product._id;
            })
            .catch(err => console.log(err));
    }

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const productId = document.getElementById('productId').value;

        fetch('/admin/edit-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, imageUrl, price, description, productId })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                window.location.href = '/admin/products.html';
            })
            .catch(err => console.log(err));
    });
}

// Admin Product List
const adminProductList = document.getElementById('admin-product-list');
if (adminProductList) {
    fetch('/admin/products')
        .then(res => res.json())
        .then(data => {
            const products = data.products;
            const noProducts = document.getElementById('no-products');

            if (products.length === 0) {
                noProducts.style.display = 'block';
                return;
            }

            products.forEach(product => {
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
            <a href="/admin/edit-product.html?id=${product._id}" class="btn">Edit</a>
            <button class="btn danger" onclick="deleteProduct('${product._id}')">Delete</button>
          </div>
        `;
                adminProductList.appendChild(card);
            });
        })
        .catch(err => console.log(err));
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    fetch('/admin/delete-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            window.location.reload();
        })
        .catch(err => console.log(err));
}
