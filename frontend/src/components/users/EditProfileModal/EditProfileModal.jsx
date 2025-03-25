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
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={editUserData.lastName || ""}
            onChange={handleEditChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editUserData.email || ""}
            onChange={handleEditChange}
          />

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={editUserData.phone || ""}
            onChange={handleEditChange}
          />

          <label>Photo URL:</label>
          <input
            type="text"
            name="photoUrl"
            value={editUserData.photoUrl || ""}
            onChange={handleEditChange}
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
