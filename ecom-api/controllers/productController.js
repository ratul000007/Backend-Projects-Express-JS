const Product = require("../models/Product");

// GET /api/products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error getting product" });
    }
};

// POST /api/products (Admin only)
exports.createPoduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
};

// PUT /api/products/:id (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: "Update falied", error: error.message });
    }
};

// DELETE /api/products/:id (Admin only)
exports.deleteProduct = async (req, res) => {
   try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
   } catch (error) {
    res.status(400).json({ message: "Delete failed", error: error.message });
   } 
};