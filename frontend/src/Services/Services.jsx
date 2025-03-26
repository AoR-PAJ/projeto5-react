const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";

export const ProductService = {
  async fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/category/all`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  },

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
};
