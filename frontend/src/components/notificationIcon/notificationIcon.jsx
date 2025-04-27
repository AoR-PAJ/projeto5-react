import React, { useState, useEffect } from "react";
import { useNotificationStore } from "../../stores/useNotificationStore";
import NotificationList from "../notificationList/notificationList";
import { useAuthStore } from "../../stores/useAuthStore";

const NotificationIcon = ({ token }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );

  const username = useAuthStore((state) => state.username);

  const fetchData = async () => { 
      try {
        await fetchNotifications(token, username, false); // Busca notificações não lidas
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    
  };

  useEffect(() => {
    fetchData(); // Busca notificações ao montar o componente

    const interval = setInterval(() => {
      fetchData(); // Atualiza notificações a cada 5 segundos
    }, 5000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [token, username, fetchNotifications]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="position-relative m-3">
      <button
        className="notification-icon btn btn-dark rounded position-relative p-1"
        style={{ border: "none", outline: "none" }}
        onClick={toggleNotifications}
      >
        <i className="bi bi-bell-fill" style={{ fontSize: "1.5rem" }}></i>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", minWidth: "16px", minHeight: "16px" }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <div
          className="position-absolute"
          style={{ top: "50px", right: "0px", zIndex: 1050 }}
        >
          <NotificationList
            token={token}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
