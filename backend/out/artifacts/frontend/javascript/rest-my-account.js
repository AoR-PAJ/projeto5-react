// Função para exibir as informações do utilizador
function displayUserInfo(user) {
    const accountInfoDiv = document.getElementById("account-info");
    if (!user) {
        accountInfoDiv.innerHTML = `<p>Error: User data is not available.</p>`;
        return;
    }

    const { photoUrl, firstName, lastName, username, email, phone } = user;

    accountInfoDiv.innerHTML = `
        <img src="${photoUrl || 'default-photo.png'}" alt="User Photo">
        <div>
            <p><strong>First Name:</strong> ${firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> ${lastName || 'N/A'}</p>
            <p><strong>Username:</strong> ${username || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        </div>
    `;
}

// Função para buscar os dados do utilizador no backend (JSON)
async function fetchUserData() {
    const accountInfoDiv = document.getElementById("account-info");
    const currentUsername = sessionStorage.getItem("username"); // Recupera o username do sessionStorage

    try {
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${currentUsername}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const user = await response.json();
        displayUserInfo(user);

        // Preencher o formulário de edição com os dados do utilizador
        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("phone").value = user.phone || "";
        document.getElementById("photoUrl").value = user.photoUrl || "";
    } catch (error) {
        console.error("Error fetching user data:", error);
        accountInfoDiv.innerHTML = `<p>Error loading user information.</p>`;
    }
}

// Função para configurar os ouvintes de eventos
function setupEventListeners() {
    const editButton = document.getElementById("edit-button");
    const editForm = document.getElementById("edit-form");
    const cancelButton = document.getElementById("cancel-edit");
    const updateForm = document.getElementById("update-form");
    const accountInfoDiv = document.getElementById("account-info");
    const currentUsername = sessionStorage.getItem("username");

    console.log("Username recuperado:", currentUsername); // Debug

    if (!currentUsername) {
        alert("Erro: Nenhum utilizador autenticado encontrado. Faça login novamente.");
        return;
    }

    if (editButton) {
        editButton.addEventListener("click", async () => {
            await fetchUserData(); // Recarrega os dados diretamente do backend e exibe no formulário de edição
            editForm.style.display = "block";
            accountInfoDiv.style.display = "none";
            editButton.style.display = "none";
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            editForm.style.display = "none";
            accountInfoDiv.style.display = "block";
            editButton.style.display = "inline-block";
        });
    }

    if (updateForm) {
        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const updatedUser = {
                username: currentUsername, // Adiciona o username ao body
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                photoUrl: document.getElementById("photoUrl").value
            };

            console.log("Dados a serem enviados para o backend:", updatedUser); // Debug

            try {
                const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${currentUsername}`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "username": currentUsername // Passando o username no cabeçalho
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to update user: ${errorText}`);
                }

                alert("User information updated successfully!");
                editForm.style.display = "none";
                accountInfoDiv.style.display = "block";
                editButton.style.display = "inline-block";

                // Recarregar os dados para atualizar as mudanças
                await fetchUserData();
            } catch (error) {
                console.error("Error updating user:", error);
                alert("Error updating user information.");
            }
        });
    }
}

// Função para obter os elementos DOM
function getDomElements() {
    return {
        accountInfo: document.getElementById("account-info"),
        editForm: document.getElementById("edit-form"),
        editButton: document.getElementById("edit-button"),
        cancelButton: document.getElementById("cancel-edit"),
        updateForm: document.getElementById("update-form")
    };
}

// O evento 'DOMContentLoaded' é disparado quando o conteúdo HTML foi completamente carregado,
// garantindo que o código seja executado somente depois de a página ser totalmente carregada.
document.addEventListener("DOMContentLoaded", async () => {
    const currentUsername = sessionStorage.getItem("username");
    const accountInfoDiv = document.getElementById("account-info");

    // Se não houver utilizador autenticado, exibe mensagem
    if (!currentUsername) {
        accountInfoDiv.innerHTML = `<p>No account information found.</p>`;
        return;
    }

    // Carregar os dados do utilizador ao abrir a página
    await fetchUserData();
    setupEventListeners();
});

// Exporta as funções para uso nos testes
module.exports = {
    displayUserInfo,
    setupEventListeners,
    getDomElements
};