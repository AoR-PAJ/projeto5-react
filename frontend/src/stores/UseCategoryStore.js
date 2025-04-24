import { create } from "zustand";
import { Service } from "../Services/Services";

export const useCategoryStore = create((set) => ({
  categories: [],
  categoriesWithProductCount: [],

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

  //Metodo para criar uma nova categoria
  createCategory: async (categoryName, token) => {
    try {
      // Chama a função do Service para criar a categoria no backend
      const data = await Service.createCategory(categoryName, token);

      if (data) {
        set((state) => ({
          categories: [...state.categories, { nome: categoryName }], // Atualiza a store com a nova categoria
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      return false;
    }
  },

  // Método para obter a quantidade de produtos por categoria
  fetchCategoriesSortedByProductCount: async () => {
    try {
      const data = await Service.fetchCategoriesSortedByProductCount();

      const transformedData = data.map((item) => ({
        nome: item.category, // Renomeia "category" para "nome"
        productCount: item.productCount, // Mantém "productCount"
      }));

      set({ categoriesWithProductCount: transformedData }); // Atualiza o novo estado
    } catch (error) {
      console.error("Erro ao buscar categorias ordenadas:", error);
    }
  },
}));
