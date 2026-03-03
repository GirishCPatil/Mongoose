const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.json({ message: 'Product created successfully!', product: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to create product' });
    });
};

exports.getEditProduct = (req, res, next) => {
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.json({ message: 'Product updated successfully!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to update product' });
    });
};

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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.json({ message: 'Product deleted successfully!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Failed to delete product' });
    });
};
