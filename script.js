// Login form
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');

// Register form
const registerForm = document.getElementById('register-form');
const registerFullnameInput = document.getElementById('register-fullname');
const registerEmailInput = document.getElementById('register-email');
const registerMobileInput = document.getElementById('register-mobile');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');

// Dashboard
const dashboardContainer = document.getElementById('dashboard-container');
const userTable = document.getElementById('user-table');
const logoutBtn = document.getElementById('logout-btn');

// Register link
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');

// Handle login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    // Check if the user is registered
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.username === username && u.password === password);

    if (user) {
        // Save the user's information in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
});

// Handle registration
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fullname = registerFullnameInput.value;
    const email = registerEmailInput.value;
    const mobile = registerMobileInput.value;
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    // Check if the username is already taken
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    if (registeredUsers.find(u => u.username === username)) {
        alert('Username already taken');
        return;
    }

    // Save the new user to session storage
    const newUser = { fullname, email, mobile, username, password };
    registeredUsers.push(newUser);
    sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful! Please log in.');
    showLoginForm();
});

// Show the login form
function showLoginForm() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
}

// Show the registration form
function showRegisterForm() {
    document.getElementById('register-container').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
}

// Show the dashboard
function showDashboard() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    populateUserTable();
    document.getElementById('dashboard-container').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.add('hidden');
}
// Populate the user table
function populateUserTable() {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const userTableBody = userTable.getElementsByTagName('tbody')[0];
    userTableBody.innerHTML = '';

    registeredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.username}</td>
            <td>
                <div class="btn-group">
                    <button class="update-btn" data-index="${index}">Update</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            </td>
        `;
        userTableBody.appendChild(row);
    });

    const updateButtons = document.querySelectorAll('.update-btn');
    updateButtons.forEach(btn => {
        btn.addEventListener('click', () => updateUser(btn.dataset.index));
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.index));
    });
}
// Handle user update
function updateUser(index) {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers[index];

    const newFullname = prompt('Enter new full name:', user.fullname);
    const newEmail = prompt('Enter new email:', user.email);
    const newMobile = prompt('Enter new mobile number:', user.mobile);
    const newUsername = prompt('Enter new username:', user.username);

    if (newFullname && newEmail && newMobile && newUsername) {
        user.fullname = newFullname;
        user.email = newEmail;
        user.mobile = newMobile;
        user.username = newUsername;
        registeredUsers[index] = user;
        sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        populateUserTable();
    }
}

// Handle user deletion
function deleteUser(index) {
    const registeredUsers = JSON.parse(sessionStorage.getItem('registeredUsers')) || [];
    const confirmation = confirm(`Are you sure you want to delete the user "${registeredUsers[index].username}"?`);

    if (confirmation) {
        registeredUsers.splice(index, 1);
        sessionStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        populateUserTable();
    }
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    showLoginForm();
});

// Initialize the app
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (currentUser) {
    showDashboard();
} else {
    showLoginForm();
}

// Show the registration form when the "Register" link is clicked
registerLink.addEventListener('click', showRegisterForm);
loginLink.addEventListener('click', showLoginForm);