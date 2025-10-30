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

const auth = new Auth();
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

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (auth.login(username, password)) {
        window.location.href = 'expenses.html';
    } else {
        showError(loginForm, 'Invalid username or password');
    }
});

// Handle Registration
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError(registerFormElement, 'Passwords do not match');
        return;
    }

    if (auth.register(username, password)) {
        showSuccess(registerFormElement, 'Registration successful! Please login.');
        setTimeout(() => {
            registerForm.classList.add('hidden');
            loginForm.parentElement.classList.remove('hidden');
        }, 1500);
    } else {
        showError(registerFormElement, 'Username already exists');
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