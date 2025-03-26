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
}));
