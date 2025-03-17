function checkLogin(event) {
  event.preventDefault(); // Impede o link de redirecionar imediatamente

  const username = sessionStorage.getItem("username");

  if (username) {
    // Se o utilizador estiver logado, vai para a página de criação de produtos
    window.location.href = "create-product.html";
  } else {
    // Se não estiver logado, redireciona para o login
    window.location.href = "log-in.html";
    alert("You need to be logged in to start selling!");
  }
}

// Adicionei esta função!
function updateUserAvatar() {
  const userProfilePictureUrl = sessionStorage.getItem("photoUrl");
  if (userProfilePictureUrl) {
      document.getElementById("user-avatar").src = userProfilePictureUrl;
  }
}

// Chame a função para atualizar a fotografia do avatar quando a página for carregada
document.addEventListener("DOMContentLoaded", function() {
  updateUserAvatar();
});

// No final do ficheiro onde estão as funções
module.exports = {
  checkLogin,
  updateUserAvatar
};
