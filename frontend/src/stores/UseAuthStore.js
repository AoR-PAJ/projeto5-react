import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Service } from "../Services/Services";
import { Navigate } from "react-router-dom";



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
          const token = get().token;

          if (token) {
            alert(
              "Sua sessão expirou devido à inatividade. Você será desconectado."
            );
            get().logout();
          }
          return false;
        }
        return true;
      },

      //metodo para alterar o session timeout
      updateSessionTimeout: async (minutes, navigate) => {
        try {
          const token = get().token;
          const result = await Service.updateSessionTimeout(minutes, token);
          alert(result); // Exibe a mensagem de sucesso retornada pelo serviço
        } catch (error) {
          alert("Erro ao atualizar o tempo de expiração: " + error.message);
          if (
            error.message.includes(
              "Token de autorização ausente ou inválido"
            ) ||
            error.message.includes("Acesso negado")
          ) {
            navigate("/login");
          }
        }
      },


      //metodo para fazer logout
      logout: async () => {
        try {
          const token = get().token;

          // Chama o serviço de logout no backend
          if (token) {
            await Service.logout(token);
          }

          // Reseta o estado global
          set({
            username: "",
            profilePicture: "",
            admin: false,
            isVerified: false,
            isActive: false,
            token: null,
            sessionExpiration: null,
          });

          // Redireciona para a página de login
          window.location.href = "/login";
        } catch (error) {
          console.error("Erro ao fazer logout:", error);
        }
      },
    }),
    {
      name: "mystore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
