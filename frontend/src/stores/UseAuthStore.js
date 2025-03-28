import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Service } from "../Services/Services";

export const useAuthStore = create(
  persist(
    (set) => ({
      //valores iniciais 
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,

      //atualizacao do username, imagem e credenciais de administrador
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),

      //metodo que  faz logout
      logout: async (token) => {
        try {
          const result = await Service.logout(token);
          if (result) {
            // faz reset das credenciais
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
