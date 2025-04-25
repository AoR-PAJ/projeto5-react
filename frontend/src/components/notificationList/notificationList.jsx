import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import "./notificationList.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { FormattedMessage } from "react-intl";

const NotificationList = ({ onClose }) => {
  const token = useAuthStore((state) => state.token);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );
  const markNotificationsAsRead = useNotificationStore(
    (state) => state.markNotificationsAsRead
  );
  const notifications = useNotificationStore((state) => state.notifications);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await fetchNotifications(token);
        await markNotificationsAsRead(token); 
      }
    };
    fetchData();
  }, [token, fetchNotifications, markNotificationsAsRead]);

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
