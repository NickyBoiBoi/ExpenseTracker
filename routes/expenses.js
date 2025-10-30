const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/expense');

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get all expenses for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId })
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error('Fetch expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new expense
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { description, amount, date } = req.body;
        const expense = await Expense.create({
            description,
            amount,
            date,
            user: req.user.userId
        });
        res.status(201).json(expense);
    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });
        
        if (expense) {
            res.json({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;