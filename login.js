// Verifica se já existe um usuário logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

// Adiciona evento de submit ao formulário de login
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
});

// Função para verificar status do login
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showUserPanel(currentUser);
    } else {
        showLoginForm();
    }
}

// Função para lidar com o login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Em um sistema real, você faria a validação com um backend
    if (username && password) {
        localStorage.setItem('currentUser', username);
        showUserPanel(username);
        document.getElementById('authForm').reset();
    }
}

// Função para mostrar o painel do usuário
function showUserPanel(username) {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('userPanel').classList.add('active');
    document.getElementById('userDisplay').textContent = username;
    loadUserNotes();
}

// Função para mostrar o formulário de login
function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('userPanel').classList.remove('active');
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('userNotes').innerHTML = '';
    showLoginForm();
}

// Função para salvar uma nova nota
function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value.trim();
    
    if (note) {
        const currentUser = localStorage.getItem('currentUser');
        const userNotes = JSON.parse(localStorage.getItem(`notes_${currentUser}`) || '[]');
        userNotes.push(note);
        localStorage.setItem(`notes_${currentUser}`, JSON.stringify(userNotes));
        
        noteInput.value = '';
        loadUserNotes();
    }
}

// Função para carregar as notas do usuário
function loadUserNotes() {
    const currentUser = localStorage.getItem('currentUser');
    const userNotes = JSON.parse(localStorage.getItem(`notes_${currentUser}`) || '[]');
    const notesContainer = document.getElementById('userNotes');
    
    notesContainer.innerHTML = userNotes.map(note => 
        `<div class="note">${note}</div>`
    ).join('');
}