import { create } from "zustand";
import { Service } from "../Services/Services";


export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,

  // Função para definir os produtos
  setProducts: (newProducts) => set({ products: newProducts }),

  fetchProducts: async () => {
    try {
      const data = await Service.fetchAllProducts();
      // const data = await response.json();
      set({ products: data });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  },

  // Buscar um produto específico pelo ID
  fetchProductById: async (productId) => {
    try {
      const data = await Service.fetchProductById(productId);
      set({ selectedProduct: data });
      return data;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  },

  //Buscar todos os produtos de um user
  fetchUserProducts: async (usernameParam, token) => {
    try {
      const response = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/user/${usernameParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter produtos");
      }

      const productsData = await response.json();
      set({ products: productsData });
    } catch (error) {
      console.error("Erro ao buscar produtos do usuário:", error.message);
    }
  },

  //Inativar produtos
  inactivateProduct: async (sellerId, productId, token, navigate) => {
    try {
      await Service.inactivateProduct(sellerId, productId, token);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId), // Remove da lista
        selectedProduct: null, // Reseta o produto detalhado
      }));
      alert("Produto apagado com sucesso!");
      navigate("/homePage");
    } catch (error) {
      console.error("Erro ao inativar produto:", error);
      alert("Erro ao apagar produto.");
      throw error;
    }
  },

  //atualizar dados do produto para um user normal
  updateProductByUser: async (productId, updatedData, token) => {
    try {
      const updatedProduct = await Service.updateProductByUser(
        productId,
        updatedData,
        token
      );
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        selectedProduct: updatedProduct,
      }));
    } catch (error) {
      console.error("Erro na atualização do produto:", error);
      throw error;
    }
  },

  //atualizar produtos por um admin
  updateProductByAdmin: async (productId, updatedData, token) => {
    try {
      const updatedProduct = await Service.updateProductByAdmin(
        productId,
        updatedData,
        token
      );
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        selectedProduct: updatedProduct,
      }));
    } catch (error) {
      console.error("Erro na atualização do produto pelo admin:", error);
      throw error;
    }
  },
}));
