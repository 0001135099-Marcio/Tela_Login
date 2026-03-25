// --- CONFIGURAÇÕES INICIAIS ---
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const dashboardBox = document.getElementById('dashboardBox');
const userNameDisplay = document.getElementById('userNameDisplay');

// Verifica se o usuário já está logado ao carregar a página
window.onload = () => {
    const savedUser = localStorage.getItem('userName');
    if (savedUser) {
        showDashboard(savedUser);
    }
};

// --- FUNÇÕES DE INTERFACE ---

function toggleForm() {
    loginBox.classList.toggle('hidden');
    registerBox.classList.toggle('hidden');
    
    // Adiciona animação ao que aparecer
    if (!registerBox.classList.contains('hidden')) {
        registerBox.classList.add('fade-in');
    } else {
        loginBox.classList.add('fade-in');
    }
}

function showDashboard(name) {
    loginBox.classList.add('hidden');
    registerBox.classList.add('hidden');
    dashboardBox.classList.remove('hidden');
    dashboardBox.classList.add('fade-in');
    userNameDisplay.innerText = name;
}

function logout() {
    localStorage.removeItem('userName');
    location.reload(); // Recarrega para voltar ao estado inicial
}

// --- VALIDAÇÃO DE SENHA ---
function validarSenha(senha) {
    const temLetra = /[a-zA-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!temLetra || !temNumero) return "A senha deve conter letras e números.";
    
    return null; // Senha OK
}

// --- LÓGICA DE CADASTRO ---
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Validação de senha no cliente
    const erro = validarSenha(password);
    if (erro) return alert(erro);

    btn.disabled = true; // Inicia Spinner

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("Cadastro realizado! Agora faça seu login.");
            toggleForm();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor. Verifique se o Node.js está rodando.");
    } finally {
        btn.disabled = false; // Para Spinner
    }
});

// --- LÓGICA DE LOGIN ---
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    btn.disabled = true; // Inicia Spinner

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userName', data.user.name);
            showDashboard(data.user.name);
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor.");
    } finally {
        btn.disabled = false; // Para Spinner
    }
});