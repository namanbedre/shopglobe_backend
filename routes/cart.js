const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item
router.put('/:productId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => item.product.toString() === req.params.productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from cart
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;