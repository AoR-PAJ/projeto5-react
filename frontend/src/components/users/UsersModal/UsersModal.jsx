import React from "react";
import { Link } from "react-router-dom";

const UsersModal = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Registered Users</h2>
        {users.length > 0 ? (
          <ul className="user-list">
            {users.map((user) => (
              user.username !== "Utilizador_Excluido" && 
              <Link to={`/profile?id=${user.username}`} key={user.id}>
                <li>{user.username}</li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UsersModal;
