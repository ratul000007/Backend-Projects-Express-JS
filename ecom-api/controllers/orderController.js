const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.checkout = async (req, res) => {
    try {
        // Get user cart
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        //Calculate total price
        let totalPrice = 0;
        for(const item of cart.items) {
            if (item.product.countInStock < item.quantity) {
                return res.status(400).json({ message: `Not enough for product ${item.product.name}`});
            }
            totalPrice += item.product.price * item.quantity;
        }

        // Reduce stock quantity
        for (const item of cart.items) {
            item.product.countInStock -= item.quantity;
            await item.product.save();
        }

        //Create order
        const order = await Order.create({
            user: req.user._id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalPrice,
        });

        //Clear User cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Checkout failed", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};