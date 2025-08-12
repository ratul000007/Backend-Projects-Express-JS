const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense, getMonthlySummary } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware')
const router = express.Router();


router.route("/")
    .post(protect, createExpense)
    .get(protect, getExpenses);

router.route('/:id')
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

router.get("/summary", protect, getMonthlySummary);
module.exports = router;