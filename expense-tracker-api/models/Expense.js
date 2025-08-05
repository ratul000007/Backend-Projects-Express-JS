const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    amount: {
        type: Number, 
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);