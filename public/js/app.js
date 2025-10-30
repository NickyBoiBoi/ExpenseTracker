const API_URL = '/api';

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

let expenses = [];

// Add logout button
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.className = 'btn logout-btn';
document.querySelector('.container').insertBefore(logoutBtn, document.querySelector('h1'));

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const expensesList = document.getElementById('expensesList');
const totalAmountElement = document.getElementById('totalAmount');

// Set today's date as default
dateInput.valueAsDate = new Date();

// Fetch expenses from API
async function fetchExpenses() {
    try {
        const res = await fetch(`${API_URL}/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch expenses');
        expenses = await res.json();
        renderExpenses();
    } catch (err) {
        console.error('Error fetching expenses:', err);
    }
}

// Add expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const expenseData = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value
    };

    try {
        const res = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(expenseData)
        });
        if (!res.ok) throw new Error('Failed to add expense');
        const newExpense = await res.json();
        expenses.unshift(newExpense);
        renderExpenses();
        expenseForm.reset();
        dateInput.valueAsDate = new Date();
    } catch (err) {
        console.error('Error adding expense:', err);
    }
});

// Delete expense
async function deleteExpense(id) {
    try {
        const res = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete');
        expenses = expenses.filter(expense => expense._id !== id);
        renderExpenses();
    } catch (err) {
        console.error('Error deleting expense:', err);
    }
}

// Calculate total
function calculateTotal() {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Render expenses
function renderExpenses() {
    expensesList.innerHTML = '';
    totalAmountElement.textContent = calculateTotal();

    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div>${expense.description}</div>
            <div>$${parseFloat(expense.amount).toFixed(2)}</div>
            <div>${formatDate(expense.date)}</div>
            <button class="delete-btn" data-id="${expense._id}">Delete</button>
        `;
        expensesList.appendChild(expenseElement);
    });

    // attach delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteExpense(btn.getAttribute('data-id')));
    });
}

// Initial fetch
fetchExpenses();