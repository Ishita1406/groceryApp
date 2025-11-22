import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router()


// GET /products  (optionally support ?q=&category=)
router.get('/', async (req, res) => {
  try {
    const { q, category, page=1, limit=10 } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter); 

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // optional

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /products
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;
    const product = new Product({ name, price, imageUrl, category, description, stock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', details: err.message });
  }
});

// PUT /products/:id  → Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, imageUrl, category, description, stock },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: 'Bad request', details: err.message });
  }
});


// DELETE /products/:id  → Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;