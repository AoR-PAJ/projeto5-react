import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categories: [],

  // Método para definir as categorias
  setCategories: (categories) => set({ categories }),

  // Método para buscar as categorias da API
  fetchCategories: async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/category/all"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar categorias!");
      }
      const data = await response.json();
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
