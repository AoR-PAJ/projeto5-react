import { create } from "zustand";
import { Service } from "../Services/Services";

export const useCategoryStore = create((set) => ({
  categories: [],

  // Método para definir as categorias
  setCategories: (categories) => set({ categories }),

  // Método para buscar as categorias da API
  fetchCategories: async () => {
    try {
      const data = await Service.fetchCategories();
      
      set({ categories: data }); // Atualiza o estado global com as categorias
    } catch (Error) {
      console.error("Erro ao buscar categorias:", Error);
    }
  },

  // Método para adicionar uma nova categoria à lista
  addCategory: (newCategory) =>
    set((state) => ({
      categories: [...state.categories, { nome: newCategory }],
    })),
}));
