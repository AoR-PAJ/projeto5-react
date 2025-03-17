document.addEventListener("DOMContentLoaded", () => {
    const username = sessionStorage.getItem("username");
  
    if (username) {
        const updateUsername = () => {
        const displayUsernameElement = document.getElementById("display-username");
            if (displayUsernameElement) {
                displayUsernameElement.innerText = username;
                observer.disconnect(); // Para de observar após atualização
            }
        };
  
        // Observador para mudanças no DOM
        const observer = new MutationObserver(updateUsername);
        observer.observe(document.body, { childList: true, subtree: true });
  
        // Tentar atualizar imediatamente caso o elemento já exista
        updateUsername();
    } else {
        console.log("Nenhum username encontrado na sessionStorage.");
    }
  });