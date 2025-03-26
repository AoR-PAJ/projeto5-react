const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";

export const Service = {
  // Função para buscar categorias
  async fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/category/all`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para criar um novo produto
  async createProduct(username, token, productData) {
    const url = `${BASE_URL}/users/${username}/addProducts`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Erro ao criar o produto");
      }

      alert("Produto criado com sucesso!");
      window.location.reload();
      return response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar todos os produtos
  async fetchAllProducts() {
    try {
      const response = await fetch(`${BASE_URL}/products/all`);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar produtos por categoria
  async fetchProductsByCategory(category) {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) throw new Error("Erro ao buscar produtos por categoria");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Função para buscar produtos de um usuário específico
  async fetchProductsByUser(userId, token) {
    try {
      const response = await fetch(`${BASE_URL}/products/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar produtos por usuário");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
