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
      phone: "",
      email: "",
      sessionTimeoutMinutes: null,

      // Atualização do username, imagem, credenciais de administrador, verificação e ativação
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),
      updateVerified: (isVerified) => set({ isVerified }),
      updateActive: (isActive) => set({ isActive }),

      // Método para configurar o login e a expiração da sessão
      login: async (token, isVerified, isActive, admin) => {
        try {
          // Chama o serviço para obter o tempo de expiração da sessão
          const response = await Service.getSessionTimeout(token);
          const sessionTimeoutMinutes = response.sessionExpirationMinutes;

          if (!sessionTimeoutMinutes || sessionTimeoutMinutes <= 0) {
            console.error(
              "Tempo de expiração inválido retornado pelo backend."
            );
            return;
          }

          // Calcula o tempo de expiração inicial
          const expirationTime =
            new Date().getTime() + sessionTimeoutMinutes * 60 * 1000;

          // Atualiza o estado global com os dados do login e o tempo de expiração
          set({
            token,
            sessionExpiration: expirationTime,
            sessionTimeoutMinutes, // Armazena o valor do tempo de expiração no estado global
            isVerified,
            isActive,
            admin,
          });

          console.log(
            "Login realizado com sucesso. Tempo de expiração configurado:",
            sessionTimeoutMinutes,
            "minutos"
          );
        } catch (error) {
          console.error(
            "Erro ao fazer login e obter o tempo de sessão:",
            error
          );
        }
      },

      // Método para verificar se a sessão expirou
      checkSession: () => {
        const sessionExpiration = get().sessionExpiration;
        const token = get().token;
        if (sessionExpiration && new Date().getTime() > sessionExpiration) {
          if (token) {
            alert(
              "Sua sessão expirou devido à inatividade. Você será desconectado."
            );
            get().logout(token);
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

      updateSessionExpiration: () => {
        const sessionTimeoutMinutes = get().sessionTimeoutMinutes; // Obtém o valor armazenado no estado global

        if (!sessionTimeoutMinutes || sessionTimeoutMinutes <= 0) {
          console.error("Tempo de expiração inválido no estado global.");
          return;
        }

        // Calcula o novo tempo de expiração
        const newExpirationTime =
          new Date().getTime() + sessionTimeoutMinutes * 60 * 1000;

        // Atualiza o estado global com o novo tempo de expiração
        set({ sessionExpiration: newExpirationTime });
      },

      //metodo para atualizar as informacoes do perfil na store
      updateUserProfile: async (usernameParam, token, editUserData) => {
        try {
          // Chama o serviço para atualizar o perfil
          const updatedUserData = await Service.updateUserProfile(
            usernameParam,
            token,
            editUserData
          );

          // Atualiza o estado global com os novos dados do usuário
          set({
            username: updatedUserData.username || get().username, // Atualiza o username, se disponível
            profilePicture: updatedUserData.photoUrl || get().profilePicture, // Atualiza a foto
            email: updatedUserData.email || get().email, // Atualiza o email, se disponível
            phone: updatedUserData.phone || get().phone, // Atualiza o telefone, se disponível
          });
        } catch (error) {
          console.error("Erro ao atualizar o perfil:", error);
          throw error;
        }
      },

      //metodo para fazer logout
      logout: async (token) => {
        try {
          const success = await Service.logout(token);

          if (success) {
            // Reseta o estado global
            set({
              username: "",
              profilePicture: "",
              admin: false,
              isVerified: false,
              isActive: false,
              token: null,
              sessionExpiration: null,
              phone: "",
              email: "",
            });

            return true;
          } else {
            return false;
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
