import { create } from "zustand";
import { Service } from "../Services/Services";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  //obtem as notificações
  fetchNotifications: async (token, userId, read) => {
    try {
      const data = await Service.fetchNotifications(token, userId, read); // Chama o serviço centralizado

      // Atualiza o estado global com as notificações e o contador de não lidas
      set((state) => {
        const unreadCount = data.filter((n) => !n.read).length;
        return {
          ...state,
          notifications: [...data],
          unreadCount,
        };
      });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  },

  //marca uma notificação como lida
  markNotificationsAsRead: async (token, username) => {
    try {
      const success = await Service.markNotificationsAsRead(token, username); // Chama o serviço centralizado

      if (success) {
        // Atualiza o estado local para refletir que todas as notificações foram lidas
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })), // Marca todas como lidas
          unreadCount: 0, // Zera o contador de notificações não lidas
        }));
      }
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  },

  //cria uma notificação
  createNotification: async (token, userId, message) => {
    try {
      await Service.createNotification(token, userId, message);
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
    }
  },
}));
