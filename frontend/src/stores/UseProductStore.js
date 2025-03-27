import { create } from "zustand";
import { Service } from "../Services/Services";


export const useProductStore = create((set) => ({
  products: [],
  //TODO: RETIRAR
  // setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const response = await Service.fetchAllProducts();
      const data = await response.json();
      set({ products: data });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  },

  // Buscar um produto específico pelo ID
  fetchProductById: async (productId) => {
    try {
      const data = await Service.fetchProductById(productId);
      return data; // Retorna o produto para ser usado onde for necessário
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error; // Para que possamos tratar o erro no componente
    }
  },
}));
