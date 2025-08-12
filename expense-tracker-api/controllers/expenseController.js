const Expense = require('../models/Expense');

// POST /api/expenses
exports.createExpense = async (req, res) => {
    const { amount, category, note, date } = req.body;

    try {
        const expense = await Expense.create({
            user: req.user.id,
            amount,
            category,
            note,
            date,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Failed to create expense" });
    }
};

// GET /api/expenses
exports.getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;

        let query = { user: req.user._id };

        if(category) {
            query.category = category; //exact match
        }

        if( startDate || endDate ) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(startDate);
        }

        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to get expenses" });
    }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true },
        );

        if (!expense) return res.status(404).json({ message: "Expense not found" });

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Failed to update expense" });
    }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!expense) return res.status(404).json({ message: "Expense not found" });

        res.json({ message: "Expense deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
}

// GET /api/expenses/summary?month=2025-08
exports.getMonthlySummary = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ message: "Month query param is required (YYYY-MM)" });
        }

        const [year, monthNum] = month.split("-").map(Number);

        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59);

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate},
                },
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    _id: 0,
                },
            },
        ]);

        const totalExpenses = summary.reduce((sum, cat) => sum + cat.total, 0);

        res.json({
            month,
            totalExpenses,
            byCategory: summary,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get monthly summary" });
    };
};