import { create } from "zustand";

const BASE_URL = "http://localhost:8080/vanessa-vinicyus-proj3/rest";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  //obtem as notificações
  fetchNotifications: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }
      const data = await response.json();
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.read).length,
      });

      console.log("unreadCount", data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  },

  //marca uma notificação como lida
  markNotificationsAsRead: async (token) => {
    try {
      await fetch(`${BASE_URL}/notifications/mark-as-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ unreadCount: 0 });
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  },

  //cria uma notificação
  createNotification: async (token, userId, message) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, message }),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar notificação");
      }
      console.log("Notificação criada com sucesso");
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
    }
  },
}));
