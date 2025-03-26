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
      if (!response.ok)
        throw new Error("Erro ao buscar produtos por categoria");
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

  //Funcao para buscar todos os usuários
  async fetchUsers(token) {
    try {
      const response = await fetch(`${BASE_URL}/users/list`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //Funcao para realizar o login do user
  async loginUser(username, password) {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        return await response.text();
      } else if (response.status === 403) {
        throw new Error("Conta inativa. Credenciais rejeitadas.");
      } else {
        throw new Error("Credenciais inválidas!");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Função para buscar dados do usuário
  async getUserData(username, token) {
    try {
      const response = await fetch(`${BASE_URL}/users/${username}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
