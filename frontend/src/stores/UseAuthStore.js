import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Service } from "../Services/Services";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Valores iniciais
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,
      isVerified: false, 
      isActive: false, 
      token: null,
      sessionExpiration: null,

      // Atualização do username, imagem, credenciais de administrador, verificação e ativação
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),
      updateVerified: (isVerified) => set({ isVerified }), 
      updateActive: (isActive) => set({ isActive }), 

      // Método para configurar o login e a expiração da sessão
      login: (token, sessionExpirationMinutes, isVerified, isActive, admin) => {
        const expirationTime =
          new Date().getTime() + sessionExpirationMinutes * 60 * 1000; 
        set({
          token,
          sessionExpiration: expirationTime,
          isVerified,
          isActive,
          admin,
        });
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
              isVerified: false,
              isActive: false,
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
