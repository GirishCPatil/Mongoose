const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.json({ products: products });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch products' });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ product: product });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch product' });
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.json({ products: products });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch products' });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.filter(i => i.productId);
      res.json({ products: products });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch cart' });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.json({ message: 'Product added to cart!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to add to cart' });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.json({ message: 'Product removed from cart!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to remove from cart' });
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
        .filter(i => i.productId)
        .map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      req.user.cart = { items: [] };
      return req.user.save();
    })
    .then(() => {
      res.json({ message: 'Order placed successfully!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to place order' });
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.json({ orders: orders });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch orders' });
    });
};
