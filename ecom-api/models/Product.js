const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: String,
    price: {
        type: Number,
        required: true,
    },
    description: String,
    countInStock: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);