$(document).ready(function() {
    // Register user
    $('#register-form').submit(function(event) {
        event.preventDefault();

        const username = $('#username').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.find(user => user.username === username)) {
            alert('Username already exists!');
            return;
        }

        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });

    // Login user
    $('#login-form').submit(function(event) {
        event.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.length === 0) {
            alert('No users found. Please register first.');
            window.location.href = 'register.html';
            return;
        }

        const user = users.find(user => user.username === username && user.password === password);

        if (!user) {
            alert('Invalid username or password!');
            return;
        }

        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    });

    // Check if user is logged in
    function checkLogin() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            $('#greeting').text(`Hi, ${currentUser}`);
        }
    }

    // Logout user
    $('#logout').click(function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Check login on index page
    if (window.location.pathname.endsWith('index.html')) {
        checkLogin();
    }
});
