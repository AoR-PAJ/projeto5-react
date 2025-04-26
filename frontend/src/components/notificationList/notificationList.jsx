import React, { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

const NotificationList = ({ onClose }) => {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );
  const markNotificationsAsRead = useNotificationStore(
    (state) => state.markNotificationsAsRead
  );
  const notifications = useNotificationStore((state) => state.notifications);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token && username) {
        await fetchNotifications(token, username, false); 
        //await markNotificationsAsRead(token, username); 
      }
    };
    fetchData();
  }, [token, username, fetchNotifications, markNotificationsAsRead]);

  const handleNotificationClick = (notification) => {
  // Extrai o nome do comprador da mensagem
  const regex = /O usuário (\w+) comprou seu produto:/;
  const match = notification.message.match(regex);

  if (match && match[1]) {
    const buyerUsername = match[1]; // Nome do comprador extraído
    navigate(`/users/${buyerUsername}`);
    onClose(); // Fecha a lista de notificações
  } else {
    console.error("Não foi possível extrair o nome do comprador da mensagem.");
    alert("Erro ao redirecionar para o perfil do comprador.");
  }
};

  return (
    <div className="notification-list card shadow-lg">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FormattedMessage id="notifications" />
        </h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body p-0">
        <ul className="list-group list-group-flush">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className="list-group-item d-flex align-items-start"
                onClick={() => handleNotificationClick(notification)} 
                style={{ cursor: "pointer" }}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{notification.message}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">
              <FormattedMessage id="no-notifications" />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationList;
