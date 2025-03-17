(() => {
    document.addEventListener("DOMContentLoaded", () => {

        console.log("chama este script");

      const currentUrl = window.location.href;
      const username = sessionStorage.getItem("username");

    if (username) {

      if (currentUrl.includes("create-product") || currentUrl.includes("user-products")) {
        loggedUserHeader1();
      }

      if (currentUrl.includes("homePage")) {
        loggedUserHeader2();
      }

      if (currentUrl.includes("my-account") || currentUrl.includes("product-details")) {
        loggedUserHeader3();
      }

    } else {

    if (currentUrl.includes("homePage")) {
        unloggedUserHeader1();
    }

    if (currentUrl.includes("log-in")) {
        unloggedUserHeader2();
    }

    if (currentUrl.includes("product-details")) {
        unloggedUserHeader3();
    }

    if (currentUrl.includes("register-user")) {
        unloggedUserHeader4();
    }

    }

    });
})();

// Função para buscar os dados do utilizador logado
async function fetchLoggedUser() {
    console.log("vai buscar os dados através da API");
    try {
        const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/LoggedUser`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            return await response.json(); // Retorna os dados do utilizador
        } else {
            console.log("Nenhum utilizador autenticado.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao encontrar utilizador autenticado:", error);
        return null;
    }
}

// Função para atualizar a interface com o nome e foto do utilizador
async function updateUserDisplay() {
    console.log("fez o update!");
    const user = await fetchLoggedUser(); // Chama a função para buscar os dados

    if (user) {
        // Exibir nome do utilizador
        const displayUserElement = document.getElementById("display-username");
        if (displayUserElement) {
            displayUserElement.innerText = `Hello, ${user.firstName}!`;
        }

        // Exibir foto do utilizador
        const displayPictureElement = document.getElementById("display-picture");
        if (displayPictureElement) {
            displayPictureElement.innerHTML = ""; // Limpa conteúdo anterior

            if (user.photoUrl) {
                const imgElement = document.createElement("img");
                imgElement.src = user.photoUrl;
                imgElement.alt = "User Profile Picture";
                imgElement.style.width = "50px";
                imgElement.style.height = "50px";
                displayPictureElement.appendChild(imgElement);
            }
        }
    }
}

async function loggedUserHeader1() {
    await updateUserDisplay(); // Atualiza nome e foto

    const navContainer = document.querySelector("#nav-div");
    navContainer.innerHTML = `
        <div class="nav-div">
            <ul>
                <li><a href="homePage.html">Homepage</a></li>
                <li><a href="my-account.html">My Account</a></li>
                <li><a href="homePage.html" onclick="logoutUser()">Log Out</a></li>
            </ul>
        </div>
    `;
}

async function loggedUserHeader2() {
    await updateUserDisplay(); // Atualiza nome e foto

    const navContainer = document.querySelector("#nav-div");
    navContainer.innerHTML = `
        <div class="nav-div">
            <ul>
                <li><a href="my-account.html">My Account</a></li>
                <li><a href="homePage.html" onclick="logoutUser()">Log Out</a></li>
            </ul>
        </div>
    `;
}

async function loggedUserHeader3() {
    await updateUserDisplay(); // Atualiza nome e foto

    const navContainer = document.querySelector("#nav-div");
    navContainer.innerHTML = `
        <div class="nav-div">
            <ul>
                <li><a href="homePage.html">Homepage</a></li>
                <li><a href="homePage.html" onclick="logoutUser()">Log Out</a></li>
            </ul>
        </div>
    `;
}

function unloggedUserHeader1() {
    const displayUsername = document.getElementById("welcome-note");

    const navContainer = document.querySelector("#nav-div");

    // Limpa qualquer conteúdo anterior no #nav-div
    navContainer.innerHTML = "";

    displayUsername.style.visibility = 'hidden';

    const navbar = document.createElement("nav");
    navbar.className = "nav-div";
    navbar.innerHTML = `
        <ul>
            <li><a href="register-user.html"> Register </a></li>
            <li><a href="log-in.html"> LogIn </a></li>
        </ul>
    `;
    navContainer.appendChild(navbar);
}

function unloggedUserHeader2() {
    const displayUsername = document.getElementById("welcome-note");
    displayUsername.style.visibility = 'hidden';

    const navContainer = document.querySelector("nav-div");
    // Limpa qualquer conteúdo anterior no #nav-div
    navContainer.innerHTML = "";

    const navbar = document.createElement("nav");
    navbar.className = "nav-div";
    navbar.innerHTML = `
        <ul>
            <li><a href="homePage.html">Homepage</a></li>
        </ul>
    `;
    navContainer.appendChild(navbar);
}

function unloggedUserHeader3() {
    const displayUsername = document.getElementById("welcome-note");

    const navContainer = document.querySelector("#nav-div");

    // Limpa qualquer conteúdo anterior no #nav-div
    navContainer.innerHTML = "";

    displayUsername.style.visibility = 'hidden';

    const navbar = document.createElement("nav");
    navbar.className = "nav-div";
    navbar.innerHTML = `
        <ul>
            <li><a href="homePage.html">Homepage</a></li>
            <li><a href="register-user.html"> Register </a></li>
            <li><a href="log-in.html"> LogIn </a></li>
        </ul>
    `;
    navContainer.appendChild(navbar);
}

function unloggedUserHeader4() {
    const displayUsername = document.getElementById("welcome-note");

    const navContainer = document.querySelector("#nav-div");

    // Limpa qualquer conteúdo anterior no #nav-div
    navContainer.innerHTML = "";

    displayUsername.style.visibility = 'hidden';

    const navbar = document.createElement("nav");
    navbar.className = "nav-div";
    navbar.innerHTML = `
        <ul>
            <li><a href="homePage.html">Homepage</a></li>
            <li><a href="log-in.html"> LogIn </a></li>
        </ul>
    `;
    navContainer.appendChild(navbar);
}

module.exports = {
    loggedUserHeader1,
    loggedUserHeader3,
    unloggedUserHeader1,
    unloggedUserHeader3,
    unloggedUserHeader4
  };
  