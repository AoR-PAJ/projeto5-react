import React, { useState, useEffect } from "react";
import { useNotificationStore } from "../../stores/useNotificationStore";
import NotificationList from "../notificationList/notificationList";

const NotificationIcon = ({ token }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );

  useEffect(() => {
    if (token) {
      fetchNotifications(token); 
    }
  }, [token, fetchNotifications]);
   

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="position-relative m-3">
      {/* Botão do ícone de notificações */}
      <button
        className="btn btn-light bg-light rounded position-relative p-1"
        style={{ border: "none", outline: "none" }}
        onClick={toggleNotifications}
      >
        <i className="bi bi-bell" style={{ fontSize: "1.50rem" }}></i>
        {/* Contador de notificações */}
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", minWidth: "16px", minHeight: "16px" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Lista de notificações */}
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
