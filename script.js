document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    // --- Lógica de Registro (sin cambios) ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('new-username').value;
            const email = document.getElementById('new-email').value;
            const password = document.getElementById('new-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.username === username || user.email === email);

            if (userExists) {
                errorMessage.textContent = 'El usuario o correo ya está en uso.';
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
        });
    }

    // --- Lógica de Login (CORREGIDA) ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginInput = document.getElementById('login-input').value; // Usamos un ID genérico
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // ▼▼▼ AQUÍ ESTÁ EL CAMBIO ▼▼▼
            // Ahora busca si el input coincide con el username O con el email
            const user = users.find(u => (u.username === loginInput || u.email === loginInput) && u.password === password);

            if (user) {
                // Si el login es correcto, guardamos la sesión del usuario
                sessionStorage.setItem('loggedInUser', user.username); // Guardamos el username para el saludo
                // Y lo redirigimos a la aplicación principal
                window.location.href = 'app.html';
            } else {
                errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            }
        });
    }
});
