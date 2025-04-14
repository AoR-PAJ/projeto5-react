import React from "react";
import { Link } from "react-router-dom";


const UsersModal = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2>Registered Users</h2>
          <button className="custom-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          {users.length > 0 ? (
            <ul className="custom-user-list">
              {users.map(
                (user) =>
                  user.username !== "Utilizador_Excluido" && (
                    <li key={user.id} className="custom-user-item">
                      <Link to={`/profile?id=${user.username}`}>
                        {user.username}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>
        <div className="custom-modal-footer">
          <button className="custom-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
