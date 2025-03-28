import React from "react";

const EditProfileModal = ({
  isOpen,
  onClose,
  editUserData,
  handleEditChange,
  updateProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Edit Your Information</h2>
        <form>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={editUserData.firstName || ""}
            onChange={handleEditChange}
            maxLength="20"
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={editUserData.lastName || ""}
            onChange={handleEditChange}
            maxLength="20"
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editUserData.email || ""}
            onChange={handleEditChange}
            maxLength="30"
          />

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={editUserData.phone || ""}
            onChange={handleEditChange}
            maxLength="9"
            minLength="9"
            pattern="^\d{9}$"
          />

          <label>Photo URL:</label>
          <input
            type="text"
            name="photoUrl"
            value={editUserData.photoUrl || ""}
            onChange={handleEditChange}
            maxLength="200"
          />

          <div className="button-group">
            <button
              type="button"
              className="save-button"
              onClick={updateProfile}
            >
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
