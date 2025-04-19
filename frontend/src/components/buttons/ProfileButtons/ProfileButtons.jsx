
import React from "react";
import { FormattedMessage } from "react-intl";
import { Form, useNavigate } from "react-router-dom";
import "./ProfileButtons.css";

const ProfileButtons = ({
  handleModalOpen,
  handleOpenProductsModal,
  inativarConta,
  handleUsersModalOpen,
  handleModifiedModalOpen,
  apagarConta,
  reativarConta,
  deleteAllProducts,
  isAdmin,
}) => {
  const navigate = useNavigate();
  return (
    <div className="button-container">
      {/* exibicao dos botoes para user normal e admin */}
      <button id="edit-button" onClick={handleModalOpen}>
        <FormattedMessage id="editInformation" />
      </button>

      <button id="products-button" onClick={handleOpenProductsModal}>
        <FormattedMessage id="myProducts" />
      </button>

      <button id="inactivate-account-button" onClick={inativarConta}>
        <FormattedMessage id="inactivateAccount" />
      </button>

      <button id="edit-user-button" onClick={() => navigate("/users-list")}>
        <FormattedMessage id="usersList" />
      </button>

      {/* exibicao dos botoes com opcao para admin */}
      {isAdmin && (
        <>
          <button id="reactivate-account-button" onClick={reativarConta}>
            <FormattedMessage id="reactivateAccount" />
          </button>

          <button id="delete-user-button" onClick={apagarConta}>
            <FormattedMessage id="deleteAccount" />
          </button>

          <button
            id="modified-products-button"
            onClick={handleModifiedModalOpen}
          >
            <FormattedMessage id="modifiedProducts" />
          </button>

          <button id="delete-all-products-button" onClick={deleteAllProducts}>
            <FormattedMessage id="deleteAllProducts" />
          </button>

          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </>
      )}
    </div>
  );
};

export default ProfileButtons;
