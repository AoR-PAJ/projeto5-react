import { create } from "zustand";

const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  //obtem as notificações
  fetchNotifications: async (token, userId, read) => {

    try {
      const response = await fetch(
        `${BASE_URL}/notifications?userId=${userId}&read=${read}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }
      const data = await response.json();

      // Atualiza o estado global com as notificações e o contador de não lidas
      set((state) => {
        const unreadCount = data.filter((n) => !n.read).length;
        console.log("Atualizando Zustand: unreadCount =", unreadCount);
        return {
          ...state,
          notifications: [...data],
          unreadCount,
        };
      });

      console.log(
        "Unread count atualizado:",
        data.filter((n) => !n.read).length
      );
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  },

  //marca uma notificação como lida
  markNotificationsAsRead: async (token, username) => {
    try {
      const response = await fetch(
        `${BASE_URL}/notifications/${username}/mark-as-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao marcar notificações como lidas");
      }

      // Atualiza o estado local para refletir que todas as notificações foram lidas
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })), // Marca todas como lidas
        unreadCount: 0, // Zera o contador de notificações não lidas
      }));
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  },

  //cria uma notificação
  createNotification: async (token, userId, message) => {
    try {
      const response = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, message }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao criar notificação");
      }
      console.log("Notificação criada com sucesso");
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
    }
  },
}));
