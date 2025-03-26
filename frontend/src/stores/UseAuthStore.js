import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Service } from "../Services/Services";

// Define the store
export const useAuthStore = create(
  persist(
    (set) => ({
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,

      // Função para atualizar o nome de usuário
      updateName: (username) => set({ username }),

      // Função para atualizar a foto de perfil
      updatePhoto: (profilePicture) => set({ profilePicture }),

      // Função para atualizar o status de admin
      updateAdmin: (admin) => set({ admin }),

      // Função para limpar o estado após o logout
      logout: () => set({ username: "", profilePicture: "", admin: false }),

      // Função para fazer o logout via camada de serviço
      logoutAuthStore: async (token) => {
        try {
          // Chama a função do serviço para fazer a requisição de logout
          const result = await Service.logout(token);
          if (result) {
            // Se o logout for bem-sucedido, chama a função logout da store para limpar os dados
            set({ username: "", profilePicture: "", admin: false });
            return true; 
          }
        } catch (error) {
          console.error("Erro ao fazer logout:", error);
          return false; 
        }
      },
    }),
    {
      name: "mystore", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
