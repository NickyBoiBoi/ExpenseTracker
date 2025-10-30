// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'login.html';
}

// Initialize user's expenses
const users = JSON.parse(localStorage.getItem('users')) || {};
let expenses = users[currentUser]?.expenses || [];

// Add logout button
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.className = 'btn logout-btn';
document.querySelector('.container').insertBefore(logoutBtn, document.querySelector('h1'));

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
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

// Add expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const expense = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value
    };

    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    expenseForm.reset();
    dateInput.valueAsDate = new Date();
});

// Save expenses to localStorage
function saveExpenses() {
    users[currentUser].expenses = expenses;
    localStorage.setItem('users', JSON.stringify(users));
}

// Delete expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Calculate total
function calculateTotal() {
    return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
}

// Render expenses
function renderExpenses() {
    expensesList.innerHTML = '';
    totalAmountElement.textContent = calculateTotal();

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div>${expense.description}</div>
            <div>$${expense.amount.toFixed(2)}</div>
            <div>${formatDate(expense.date)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expensesList.appendChild(expenseElement);
    });
}

// Initial render
renderExpenses();