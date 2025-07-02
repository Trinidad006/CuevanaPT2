document.addEventListener('DOMContentLoaded', () => {
  // Redirige si ya hay sesión
  if (sessionStorage.getItem('loggedInUser')) {
    window.location.href = 'app.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');
  const registerError = document.getElementById('register-error');
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');

  // Tabs
  showLoginBtn.onclick = () => {
    showLoginBtn.classList.add('active');
    showRegisterBtn.classList.remove('active');
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    errorMessage.textContent = '';
    registerError.textContent = '';
  };
  showRegisterBtn.onclick = () => {
    showRegisterBtn.classList.add('active');
    showLoginBtn.classList.remove('active');
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    errorMessage.textContent = '';
    registerError.textContent = '';
  };

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginInput = document.getElementById('login-input').value;
      const password = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => (u.username === loginInput || u.email === loginInput) && u.password === password);
      if (user) {
        sessionStorage.setItem('loggedInUser', user.username);
        window.location.href = 'app.html';
      } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos.';
      }
    });
  }

  // Registro
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('new-username').value;
      const email = document.getElementById('new-email').value;
      const password = document.getElementById('new-password').value;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(user => user.username === username || user.email === email);
      if (userExists) {
        registerError.textContent = 'El usuario o correo ya está en uso.';
        return;
      }
      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      registerError.textContent = '';
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      registerForm.reset();
      showLoginBtn.click();
    });
  }
}); 