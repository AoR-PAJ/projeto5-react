import { create } from "zustand";

const BASE_URL = "http://localhost:3000/api"; // URL base da API

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,


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
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  },

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
}));
