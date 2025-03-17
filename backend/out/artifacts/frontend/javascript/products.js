(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = window.location.href;

    if (currentUrl.includes("create-product")) {
      const form = document.getElementById("product-form");
      form.addEventListener("submit", (event) => createProduct(form, event)); // Criação do produto
    }

    if (currentUrl.includes("homePage")) {
      getAllProducts(); // Carrega todos os produtos
    }

    if (currentUrl.includes("my-account")) {
      document.getElementById("products-button").addEventListener("click", function() {
        window.location.href = "user-products.html";
    });
    }

    if (currentUrl.includes("product-details")) {
      displayProductDetails(); // Exibe detalhes do produto
    }

    if (currentUrl.includes("user-products.html")) {
      getUserProducts(); // Carrega os produtos do utilizador
    }
  });
})();


// Função que permite criar um produto e colocá-lo na base de dados através da API
// 1. A função é marcada como async para que possamos usar await dentro dela.
// Isso significa que o código dentro da função pode executar de forma assíncrona,
// permitindo que ações como requisições de rede (com fetch) não bloqueiem a
// execução do código enquanto esperam pela resposta do servidor.
// 2. O parâmetro form refere-se ao formulário HTML que foi enviado.
// É passado para a função quando o formulário é submetido através do onsubmit.
// TODO: inicio da função de criar produto e funções auxiliares

async function createProduct(form, event) {
  event.preventDefault();

  // Obtém a data atual, formata-a através de uma função e armazena o resultado numa variável.
  const date = dateFormatter(new Date());
  const imageInput = document.getElementById("image-upload");
  // Vai receber o código do status através do botão clicado
  const status = event.submitter.value;  
  // Obtém o leitor de arquivo para a imagem selecionada
  const reader = loadImage(imageInput);
  if (!reader) return;
  
  reader.onload = async function (e) {
    // Conversão da imagem para Base64
    const imageBase64 = e.target.result;

    const product = getProductData(form, imageBase64, date, status);
    // Os dados são impressos na consola para verificar a criação do produto (depuração).
    console.log(product);
   
    // Obtém o username e password do vendedor para adicionar aos dados do produto (para já virão da sessionStorage).
    const password = sessionStorage.getItem("password");
    const username = sessionStorage.getItem("username");

    console.log(username);
    console.log(password);


    const response = await sendProductToServer(product, username, password);

    // Aqui será dada a resposta à requisição
    if (response.status === 200) {
      alert("New product created!");
      // Reset do formulário após criação do produto
      form.reset();
    } else {
      alert("Something went wrong");
    }
  };
}

function dateFormatter(date) {
  const formattedDate = date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}

function loadImage(imageInput) {
  // Verifica se um arquivo foi selecionado
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    
    // Inicia a leitura do arquivo da imagem.
    reader.readAsDataURL(imageInput.files[0]);
    return reader;
  } else {
    alert("Please select an image!");
    return null;
  }
}

function getProductData(form, imageBase64, date, status) {
  // É criado e retornado o objeto product.
  return {
    category: form.category.value,
    date: date,
    description: form.description.value,
    location: form.location.value,
    picture: imageBase64,
    price: form.price.value,
    status: status,
    title: form.title.value,
  };
}

async function sendProductToServer(product, username, password) {
  const url = `http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products`;
  console.log("URL usada na requisição:", url);

  const response = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "username": username,
          "password": password
      },
      body: JSON.stringify(product)
  });

  return response;
}

// TODO: fim da função de criar produto e funções auxiliares

// Função assíncrona para ir buscar os dados dos produtos através da API e exibi-los.
async function getAllProducts() {
  console.log("entrei na função de ir buscar todos os produtos");
  // O bloco try é usado para tratar possíveis erros ao buscar os dados.
  try {
    // A função fetch() é usada para enviar a requisição HTTP ao servidor.
    // O await faz com que o código espere pela resposta antes de continuar a execução.
    const response = await fetch("http://localhost:8080/nuno-vanessa-proj2/rest/products/all", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    // Verifica se a resposta da API foi bem-sucedida, caso contrário envia o erro para o bloco catch
    if (!response.ok) {
      const error = new Error("An error occurred while retrieving the product");
      throw error;
    }
    // Converte a resposta da API para um objeto JavaScript através do método .json().
    // Como .json() retorna uma Promise, é utilizado o await para aguardar pelo processamento.
    const products = await response.json();
    // Chama a função para preencher o grid de produtos com os dados recebidos da API
    fillProductGrid(products);
  } catch (error) {
    console.error("An error occurred while loading the products:", error);
  }
}

// Função para exibir os produtos no HTML e aplicar filtro por categoria
function fillProductGrid(products) {
  const mainContainer = document.querySelector(".cards");

  if (!mainContainer) {
    console.error("Element .cards not found!");
    return;
  }

  // Limpa a mostragem dos produtos antes de recarregar
  mainContainer.innerHTML = "";

  // Obtém a categoria selecionada
  const selectedCategory = document.querySelector("input[name='category']:checked");
  const categoryValue = selectedCategory ? selectedCategory.value : null;

  // Filtra os produtos de acordo com a categoria selecionada
  const filteredProducts = categoryValue
    ? products.filter((product) => product.category === categoryValue)
    : products;

  if (filteredProducts.length === 0) {
    mainContainer.innerHTML = "<p>No products available</p>";
    return;
  }

  // Adiciona os produtos à grelha
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card-item";
    card.innerHTML = `
      <a href="product-details.html?id=${product.id}">
        <img src="${product.picture}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <p class="categoryProduct">${product.category}</p>
          <p class="nomeProduct">${product.title}</p>
          <p class="precoProduct">${product.price}€</p>
        </div>
      </a>
    `;
    mainContainer.appendChild(card);
  });
}

// Adiciona um evento para monitorar as mudanças no filtro de categoria
document.querySelectorAll("input[name='category']").forEach((radio) => {
  radio.addEventListener("change", getAllProducts);
});
// Função que controla a mostragem das opções relativas aos detalhes dos produtos
function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const username = sessionStorage.getItem("username");

  // Faz a requisição à API para buscar os detalhes do produto
  fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products/${id}`)
    .then(response => response.json())  // Converte a resposta para JSON
    .then(product => {
      if (product) {
        // Atualiza os dados do produto
        document.getElementById("product-image").src = product.picture; // Certifique-se de que a propriedade da imagem está correta
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-category").textContent = product.category;
        document.getElementById("product-price").textContent = product.price;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("product-seller").textContent = product.seller;
        document.getElementById("product-location").textContent = product.location;
        document.getElementById("product-date").textContent = product.date; // Adiciona a data de publicação

        // Adiciona os botões de ação
        const editButtons = document.getElementById("edit-buttons");
        const actionButtons = document.getElementById("action-buttons");

        if (username === product.seller) {
          editButtons.innerHTML = `
            <button class="button" onclick="editProduct(event)">Edit Product</button>
            <button class="button" onclick="deleteProduct(event)">Delete Product</button>
          `;
        }

        if (username !== product.seller) {
          actionButtons.innerHTML = `<button class="button" onclick="buyProduct(event)">Buy It Now!</button>`;
        }

        // Preencher os campos do formulário com os valores atuais
        document.getElementById("title").value = product.title;
        document.getElementById("category").value = product.category;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
        document.getElementById("location").value = product.location;
      } else {
        document.getElementById("product-details").innerHTML = "<p>Product not found</p>";
      }
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      document.getElementById("product-details").innerHTML = "<p>Error loading product details</p>";
    });
}

function editProduct(event) {
  event.preventDefault();

  // Mostrar o formulário de edição e esconder as informações do produto
  document.getElementById("edit-form").style.display = "block";
  document.getElementById("product-info").style.display = "none";

  // Preencher os campos do formulário com os valores atuais
  document.getElementById("title").value = document.getElementById("product-title").textContent;
  document.getElementById("category").value = document.getElementById("product-category").textContent;
  document.getElementById("price").value = document.getElementById("product-price").textContent;
  document.getElementById("description").value = document.getElementById("product-description").textContent;
  document.getElementById("location").value = document.getElementById("product-location").textContent;

  // Ligar o evento ao botão "Save changes"
  document.getElementById("update-form").onsubmit = function (e) {
      e.preventDefault();
      saveProductChanges();
  };

  // Ligar o evento ao botão "Cancel"
  document.getElementById("cancel-edit").onclick = function () {
      document.getElementById("edit-form").style.display = "none";
      document.getElementById("product-info").style.display = "block";
  };
}
function saveProductChanges() {
  const updatedProduct = {
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      location: document.getElementById("location").value,
      picture: document.getElementById("product-image").src || "" // Adiciona o campo picture e garante que não é nulo
  };

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  console.log("Updating product with ID:", id); // Debug
  console.log("Updated product data:", updatedProduct); // Debug

  fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products/${id}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "username": username,
          "password": password
      },
      body: JSON.stringify(updatedProduct)
  })
  .then(response => {
    if (!response.ok) {
        return response.text().then(text => Promise.reject(new Error(text))); // Usa Promise.reject para manter a cadeia de promessas
    }
    return response.clone().json().catch(() => response.text()); // Clona a response antes de tentar JSON
})

  .then(updatedData => {
      console.log("Product updated successfully:", updatedData); // Debug

      // Atualizar a interface com os novos valores
      if (typeof updatedData === 'string') {
          alert(updatedData); // Mostra a mensagem de texto retornada pelo servidor

          window.location.href = "user-products.html";
      } else {
          document.getElementById("product-title").textContent = updatedData.title;
          document.getElementById("product-category").textContent = updatedData.category;
          document.getElementById("product-price").textContent = updatedData.price;
          document.getElementById("product-description").textContent = updatedData.description;
          document.getElementById("product-location").textContent = updatedData.location;
          document.getElementById("product-image").src = updatedData.picture; // Atualiza a imagem do produto
      }

      // Ocultar o formulário de edição e mostrar as informações do produto
      document.getElementById("edit-form").style.display = "none";
      document.getElementById("product-info").style.display = "block";
  })
  .catch(error => {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again later.");
  });
}

// Chama a função para exibir os detalhes do produto quando a página é carregada
document.addEventListener("DOMContentLoaded", function() {
    displayProductDetails();
});

// Função principal que orquestra o funcionamento da funcionalidade para comprar produtos
async function buyProduct(event) {
  event.preventDefault();

  const productId = getProductIdFromUrl();
  const { username, password } = getCredentials();

  if (!productId) {
    alert("Error: product ID not found.");
    return;
  }

  try {
    const response = await requestBuyProduct(productId, username, password);
    await handleBuyProductResponse(response); // Lida com a resposta exclusiva de compra
  } catch (error) {
    console.error("Error purchasing the product:", error);
    alert("Erro na conexão com o servidor.");
  }
}

// Função para fazer a requisição PATCH para comprar o produto
async function requestBuyProduct(productId, username, password) {
  const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "password": password,
      "username": username
    }
  });

  return response;
}

// Função para tratar a resposta da requisição de compra do produto
async function handleBuyProductResponse(response) {
  if (response.ok) {
    alert("Product bought!");
    window.location.href = "homePage.html"; // Redireciona após sucesso
  } else {
    alert("Error purchasing the product.");
  }
}

// Função principal que orquestra o funcionamento da funcionalidade para apagar produtos
async function deleteProduct(event) {
  event.preventDefault();

  // Obtém os dados necessários
  const productId = getProductIdFromUrl();
  const { username, password } = getCredentials();

  if (!productId) {
    alert("Error: product ID not found.");
    return;
  }

  try {
    const response = await deleteProductFromServer(productId, username, password);
    await handleDeleteProductResponse(response);  // Usando await aqui para garantir que a resposta seja processada corretamente
  } catch (error) {
    console.error("Error deleting the product:", error);
    alert("Erro na conexão com o servidor.");
  }
}

// Função para fazer a requisição DELETE para o servidor
async function deleteProductFromServer(productId, username, password) {
  const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "password": password,
      "username": username
    }
  });
  return response;
}

// Função para lidar com o sucesso ou erro da requisição
async function handleDeleteProductResponse(response) {
  if (response.ok) {
    alert("Produto apagado com sucesso!");
    window.location.href = "homePage.html";
  } else {
    // Usando await para pegar o erro de forma simples e clara
    const errorText = await response.text();
    alert(`Error deleting product: ${errorText}`);
  }
}

// Função para obter o ID do produto da URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Função para obter as credenciais (username e password) da sessionStorage
function getCredentials() {
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");
  return { username, password };
}

// TODO: apagar as funções editField e editCategory quando verificar que a nova está a funcionar
/*
// Função para editar os campos dos produtos através da API REST
async function editField(event, field) {
  const button = event.target;
  const emptyBox = button.previousElementSibling; // O elemento <span> ao lado do botão

  if (button.textContent === "Edit") {
    // Trocar para modo de edição
    const oldInfo = emptyBox.textContent; // Obtém o valor exibido no `<span>`
    const input = document.createElement("input"); // Cria um campo de entrada
    input.type = "text"; // Define o tipo como texto
    input.value = oldInfo; // Define o valor inicial como o texto atual
    input.dataset.field = field; // Adiciona o atributo `data-field` com o nome do campo
    emptyBox.replaceWith(input); // Substitui o `<span>` pelo `<input>`
    button.textContent = "Save"; // Muda o botão para "Save"
  } else {
    // Salvar o novo valor
    const input = button.previousElementSibling; // O <input> atual
    const newValue = input.value; // Valor digitado pelo utilizador
    const fieldName = input.dataset.field; // Nome do campo que foi editado

    // Atualizar o campo no DOM
    const span = document.createElement("span");
    span.className = "editable";
    span.dataset.field = fieldName;
    span.textContent = fieldName === "price" ? `${newValue}€` : `${newValue}`; // Apenas o valor
    input.replaceWith(span); // Substitui o <input> pelo <span>
    button.textContent = "Edit"; // Volta o botão para "Edit"

    // Atualizar o produto na base de dados via API
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    try {
      const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          [fieldName]: newValue // Envia apenas o campo que foi alterado
        })
      });

      if (!response.ok) {
        throw new Error('Error updating product');
      }

      const updatedProduct = await response.json();
      console.log("Product updated:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again later.");
    }
  }
}

function editCategory(event, field) {
  const button = event.target;
  const emptyBox = button.previousElementSibling;

  if (button.textContent === "Edit") {
    const oldInfo = emptyBox.textContent.trim();
    const categories = [
      "Books",
      "Figures",
      "Homedecor",
      "Music",
      "Merchandising",
      "Video",
      "Videogames",
    ];

    const div = document.createElement("div");
    div.className = "radio-group";

    categories.forEach((category) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "category";
      input.value = category;
      if (category === oldInfo) input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(category));
      div.appendChild(label);
    });

    emptyBox.replaceWith(div);
    button.textContent = "Save";
  } else {
    const div = button.previousElementSibling;
    const selectedInput = div.querySelector("input[name='category']:checked");
    const newValue = selectedInput ? selectedInput.value : "";

    const span = document.createElement("span");
    span.className = "editable";
    span.dataset.field = field;
    span.textContent = newValue;
    div.replaceWith(span);
    button.textContent = "Edit";

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    const productsData = localStorage.getItem("products");

    const productList = JSON.parse(productsData);
    productList[id][field] = newValue;
    localStorage.setItem("products", JSON.stringify(productList));
  }
}*/

// TODO: função que vai buscar os produtos do utilizador à API
async function getUserProducts() {

    // Obtém os dados necessários
    const { username, password } = getCredentials();

  // O bloco try é usado para tratar possíveis erros ao buscar os dados.
  try {
    // A função fetch() é usada para enviar a requisição HTTP ao servidor.
    // O await faz com que o código espere pela resposta antes de continuar a execução.
    const response = await fetch(`http://localhost:8080/nuno-vanessa-proj2/rest/users/${username}/products`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "password": password,
        "username": username
      }
    });

    // Verifica se a resposta da API foi bem-sucedida, caso contrário envia o erro para o bloco catch
  if (response.status === 401) {
    throw new Error("Authentication required. Please log in.");
  }
  if (response.status === 403) {
    throw new Error("You don't have permission to access this data.");
    }
  if (!response.ok) {
    throw new Error("An error occurred while retrieving the product");
  }
    // Converte a resposta da API para um objeto JavaScript através do método .json().
    // Como .json() retorna uma Promise, é utilizado o await para aguardar pelo processamento.
    const products = await response.json();
    // Chama a função para preencher o grid de produtos com os dados recebidos da API
    fillUserProductGrid(products);
  } catch (error) {
    console.error("An error occurred while loading the products:", error);
  }
}

// Função para exibir os produtos no HTML e aplicar filtro por categoria
function fillUserProductGrid(products) {
  const mainContainer = document.querySelector(".userCards");

  if (!mainContainer) {
    console.error("Element .userCards not found!");
    return;
  }

  // Limpa a mostragem dos produtos antes de recarregar
  mainContainer.innerHTML = "";

  // Obtém a categoria selecionada
  const selectedCategory = document.querySelector("input[name='category']:checked");
  const categoryValue = selectedCategory ? selectedCategory.value : null;

  // Filtra os produtos de acordo com a categoria selecionada
  const filteredProducts = categoryValue
    ? products.filter((product) => product.category === categoryValue)
    : products;

  if (filteredProducts.length === 0) {
    mainContainer.innerHTML = "<p>No products available</p>";
    return;
  }

  // Adiciona os produtos à grelha
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card-item";
    card.innerHTML = `
      <a href="product-details.html?id=${product.id}">
        <img src="${product.picture}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <p class="categoryProduct">${product.category}</p>
          <p class="nomeProduct">${product.title}</p>
          <p class="precoProduct">${product.price}€</p>
        </div>
      </a>
    `;
    mainContainer.appendChild(card);
  });
}
// Exportando as funções para os testes
module.exports = { 
  dateFormatter, 
  getProductData, 
  loadImage };
