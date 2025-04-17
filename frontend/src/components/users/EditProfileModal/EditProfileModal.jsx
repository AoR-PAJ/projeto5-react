import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
        <h2>
          <FormattedMessage id="editYourInfo.text" />
        </h2>
        <form>
          <label>
            <FormattedMessage id="registrationForm.firstName" />:
          </label>
          <input
            type="text"
            name="firstName"
            value={editUserData.firstName}
            onChange={handleEditChange}
            maxLength="20"
            required
          />

          <label>
            <FormattedMessage id="registrationForm.lastname" />:
          </label>
          <input
            type="text"
            name="lastName"
            value={editUserData.lastName}
            onChange={handleEditChange}
            maxLength="20"
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editUserData.email}
            onChange={handleEditChange}
            maxLength="30"
            required
          />

          <label>
            <FormattedMessage id="registrationForm.phone" />:
          </label>
          <input
            type="text"
            name="phone"
            value={editUserData.phone}
            onChange={handleEditChange}
            maxLength="9"
            minLength="9"
            pattern="^\d{9}$"
            required
          />

          <label>
            <FormattedMessage id="registrationForm.photo" />:
          </label>
          <input
            type="text"
            name="photoUrl"
            value={editUserData.photoUrl}
            onChange={handleEditChange}
            maxLength="200"
            required
          />

          <div className="button-group">
            <button
              type="button"
              className="save-button"
              onClick={updateProfile}
            >
              <FormattedMessage id="saveChanges.text" />
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              <FormattedMessage id="cancelChanges.text" />
              
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
