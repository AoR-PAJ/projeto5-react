import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Service } from "../Services/Services";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      //valores iniciais
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,
      token: null,
      sessionExpiration: null,

      //atualizacao do username, imagem e credenciais de administrador
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),

      // Método para configurar o login e a expiração da sessão
      login: (token, sessionExpirationMinutes) => {
        const expirationTime =
          new Date().getTime() + sessionExpirationMinutes * 60 * 1000; // Calcula o horário de expiração
        set({ token, sessionExpiration: expirationTime });
      },

      // Método para verificar se a sessão expirou
      checkSession: () => {
        const sessionExpiration = get().sessionExpiration;
        if (sessionExpiration && new Date().getTime() > sessionExpiration) {
          get().logout(); 
          return false;
        }
        return true;
      },

      logout: async () => {
        try {
          const token = get().token;
          const result = await Service.logout(token);
          if (result) {
            // Faz reset das credenciais
            set({
              username: "",
              profilePicture: "",
              admin: false,
              token: null,
              sessionExpiration: null,
            });
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
