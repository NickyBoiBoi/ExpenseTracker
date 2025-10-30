// Handle user authentication
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
    }

    register(username, password) {
        if (this.users[username]) {
            return false;
        }
        this.users[username] = {
            password: this.hashPassword(password),
            expenses: []
        };
        this.saveUsers();
        return true;
    }

    login(username, password) {
        const user = this.users[username];
        if (user && user.password === this.hashPassword(password)) {
            localStorage.setItem('currentUser', username);
            return true;
        }
        return false;
    }

    hashPassword(password) {
        // This is a simple hash for demo purposes
        // In a real application, use proper password hashing
        return btoa(password);
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}

const API_URL = '/api';

const loginForm = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerFormElement');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Show/Hide forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.parentElement.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.parentElement.classList.remove('hidden');
});

async function apiRegister(username, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Registration failed');
    }
    return true;
}

async function apiLogin(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Login failed');
    }
    const data = await res.json();
    return data.token;
}

// Handle Login (calls API)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    removeMessages();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const token = await apiLogin(username, password);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', username);
        window.location.href = 'expenses.html';
    } catch (err) {
        showError(loginForm, err.message || 'Invalid username or password');
    }
});

// Handle Registration (calls API)
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    removeMessages();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError(registerFormElement, 'Passwords do not match');
        return;
    }

    try {
        await apiRegister(username, password);
        showSuccess(registerFormElement, 'Registration successful! Please login.');
        setTimeout(() => {
            registerForm.classList.add('hidden');
            loginForm.parentElement.classList.remove('hidden');
        }, 1200);
    } catch (err) {
        showError(registerFormElement, err.message || 'Registration failed');
    }
});

function showError(form, message) {
    removeMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccess(form, message) {
    removeMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
}

function removeMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(message => message.remove());
}