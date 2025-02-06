const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
//Create a new Product

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, stockQuantity } = req.body;

    const product = new Product({
      name,
      price,
      description,
      stockQuantity,
    });

    await product.save();
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});
module.exports = router;