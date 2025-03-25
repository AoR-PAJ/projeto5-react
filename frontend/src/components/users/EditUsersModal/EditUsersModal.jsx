import React from "react";
import { Link } from "react-router-dom";
import "./EditUsersModal.css"
const EditUsersModal = ({ isOpen, onClose, users, handleUserEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="edit-users-modal">
      <div className="edit-users-modal-content">
        <h2>Edit Users</h2>
        {users.length > 0 ? (
          <div className="users-list">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <p>
                  <Link>
                    <strong>Username:</strong> {user.username}
                  </Link>
                </p>
                
                <button onClick={() => handleUserEdit(user)}>Edit</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No users available.</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditUsersModal;
