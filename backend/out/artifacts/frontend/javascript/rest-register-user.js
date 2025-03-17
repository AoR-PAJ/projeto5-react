// O evento 'DOMContentLoaded' é disparado quando o conteúdo HTML foi completamente carregado,
// garantindo que o código seja executado somente depois de a página ser totalmente carregada.
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Faz uma requisição GET para o endpoint que verifica o utilizador logado
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/LoggedUser`, {
            method: 'GET',
            credentials: 'include' // Permite que a sessão do utilizador seja mantida (cookies, autenticação)
        });

        if (response.ok) {
            // Se a resposta for bem-sucedida (status 200), converte a resposta JSON
            const user = await response.json();

          
        

            // Armazena o nome de utilizador no sessionStorage para uso posterior
            sessionStorage.setItem("username", user.username);
        } else {
            // Se a resposta não for bem-sucedida, significa que não há utilizador logado
            console.log("Nenhum utilizador autenticado.");
            sessionStorage.removeItem("username"); // Remove qualquer utilizador armazenado no sessionStorage
        }
    } catch (error) {
        // Caso ocorra algum erro na requisição, exibe uma mensagem de erro na consola
        console.error("Erro ao encontrar utilizador autenticado:", error);
    }

    // Verifica se o elemento 'register-form' existe antes de adicionar o event listener
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Event listener for user registration form submission
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Tentando registrar o utilizador..."); // Debug

            // Vai buscar os dados do formulário
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                photoUrl: document.getElementById('photo-url').value
            };

            try {
                // Chama o endpoint de registo
                const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = '/frontend/homePage.html';
                } else {
                    const result = await response.json();
                    console.error(`Registration failed: ${result.message}`);
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            }
        });
    } else {
        console.error("Elemento 'register-form' não encontrado no DOM.");
    }
});

function validateFields() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (!firstName || !lastName || !username || !email || !phone || !password || !confirmPassword) {
        return false;
    }
    return true;
}

// Função para registrar um utilizador
async function registerUser(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (que seria enviar e recarregar a página)

    const password = document.getElementById('password').value; // Obtém o valor da senha
    const confirmPassword = document.getElementById('confirm-password').value; // Obtém o valor da confirmação da senha

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
        alert('The passwords do not match. Please try again.');
        return; // Se as senhas não coincidem, retorna sem continuar
    }

    // Cria um objeto com os dados do formulário para registo
    const registrationData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,    
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        photoUrl: document.getElementById('photo-url').value
    };

    try {
        // Envia uma requisição POST para o backend com os dados do registo
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData) // Dados do formulário convertidos para JSON
        });

        if (response.ok) {
            // Se o registo for bem-sucedido, exibe uma mensagem de sucesso e armazena o nome de utilizador e a senha
            alert('User successfully registered!');
            sessionStorage.setItem('username', registrationData.username); // Armazena o nome do utilizador no sessionStorage
            sessionStorage.setItem('password', registrationData.password); // Armazena a senha do utilizador no sessionStorage
            window.location.href = "homePage.html"; // Redireciona para a página inicial
        } else {
            const errorMsg = await response.text();
            console.error(`Error registering user: ${errorMsg}`);
            alert(`Error registering user: ${errorMsg}`);
        }
    } catch (error) {
        // Caso ocorra algum erro na requisição, exibe uma mensagem de erro
        console.error('Request error:', error);
        alert('Error connecting to the server.');
    }
}

async function loginUser(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (que seria enviar e recarregar a página)

    const loginData = {
        username: document.getElementById("username").value, // Obtém o nome do utilizador do formulário
        password: document.getElementById("password").value // Obtém a senha do formulário
    };

    try {
        // Envia uma requisição POST para o backend com os dados de login
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData), // Dados do formulário convertidos para JSON
            credentials: 'include' // Mantém a sessão ativa no navegador (cookies, etc.)
        });

        if (response.ok) {
            // Se o login for bem-sucedido, armazena o nome de utilizador e a senha no sessionStorage
            console.log("Login successful!");
            sessionStorage.setItem("username", loginData.username);
            sessionStorage.setItem("password", loginData.password);
            alert("Login successful!");
            window.location.href = "homePage.html"; // Redireciona para a página inicial
        } else {
            const errorMsg = await response.text();
            console.error(`Login failed: ${errorMsg}`);
            alert(`Error logging in: ${errorMsg}`);
        }
    } catch (error) {
        // Caso ocorra algum erro na requisição, exibe uma mensagem de erro
        console.error("Request error:", error);
        alert("Error connecting to the server.");
    }
}

// Função para fazer logout
async function logoutUser() {
    try {
        // Envia uma requisição POST para o backend solicitando o logout
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/logout`, {
            method: 'POST',
            credentials: 'include' // Garante que a sessão seja reconhecida
        });

        if (response.ok) {
            // Se o logout for bem-sucedido, limpa a sessão e redireciona para a página de login
            alert("Logout successful!");
            sessionStorage.removeItem('username'); // Remove o nome do utilizador do sessionStorage
            sessionStorage.removeItem('password'); // Remove a senha do utilizador do sessionStorage
            window.location.href = '/frontend/homePage.html';
        } else {
            const errorMsg = await response.text();
            console.error(`Logout failed: ${errorMsg}`);
            alert(`Error logging out: ${errorMsg}`);
        }
    } catch (error) {
        // Caso ocorra algum erro na requisição, exibe uma mensagem de erro
        console.error("Request error:", error);
        alert("Error connecting to the server.");
    }
}

// Exporta as funções para uso nos testes
module.exports = {
    validateFields,
    registerUser,
    loginUser,
    logoutUser
};