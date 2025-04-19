import React from "react";

const NotificationIcon = ({ notificationCount = 0 }) => {
  return (
    <div className="position-relative m-3">
      <button
        className="btn btn-light bg-light rounded position-relative p-1"
        style={{ border: "none", outline: "none" }}
      >
        <i className="bi bi-bell" style={{ fontSize: "1.50rem"}}></i>
        {/* Contador de notificações */}
        {notificationCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", minWidth: "16px", minHeight: "16px" }}
          >
            {notificationCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationIcon;
