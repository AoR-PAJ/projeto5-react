import { create } from "zustand";

export const CategoryStore = create(
  (set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),

    fetchCategories: async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/category/all"
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias!");
        }
        const data = await response.json();
        set({ categories: data });
      } catch(Error) {
        console.error("Erro ao buscar categorias!")
      }
    }
  })
)