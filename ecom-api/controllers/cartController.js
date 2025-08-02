const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper: find or create cart
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    };
    return cart;
};

// GET /api/cart
exports.getCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Failed to load cart" });
    }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await getOrCreateCart(req.user._id);
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        };

        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart);
    } catch (error) {
        res.status(400).json({ message: "Failed to add to cart", error: error.message });
    };
};

// POST /api/cart/remove
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        const populatedCart = await cart.populate("items.product");
        res.json(populatedCart);
    } catch (error) {
        res.status(400).json({ message: "Failed to remove from cart", error: error.message });
    }
};