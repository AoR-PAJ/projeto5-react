import { create } from "zustand";

// Criando a store de produtos
export const useProductStore = create((set) => ({
  products: [], // Estado inicial dos produtos

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/products/all"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      set({ products: data });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  },
}));
