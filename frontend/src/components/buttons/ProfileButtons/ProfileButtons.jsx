
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
        <span className="m-2">
          <i className="fa-solid fa-info"></i>
        </span>
        <FormattedMessage id="editInformation" />
      </button>

      <button id="products-button" onClick={handleOpenProductsModal}>
        <span className="m-2">
          <i className="fa-regular fa-lightbulb"></i>
        </span>
        <FormattedMessage id="myProducts" />
      </button>

      <button id="edit-user-button" onClick={() => navigate("/users")}>
        <span className="m-2">
          <i className="fa-solid fa-list"></i>
        </span>
        <FormattedMessage id="usersList" />
      </button>

      <button id="inactivate-account-button" onClick={inativarConta}>
        <span className="m-2">
          <i className="fa-solid fa-plug-circle-xmark"></i>
        </span>
        <FormattedMessage id="inactivateAccount" />
      </button>

      {/* exibicao dos botoes com opcao para admin */}
      {isAdmin && (
        <>
          <button id="reactivate-account-button" onClick={reativarConta}>
            <span className="m-2">
              <i className="fa-solid fa-power-off"></i>
            </span>
            <FormattedMessage id="reactivateAccount" />
          </button>

          <button id="delete-user-button" onClick={apagarConta}>
            <span className="m-2">
              <i className="fa-solid fa-trash"></i>
            </span>
            <FormattedMessage id="deleteAccount" />
          </button>

          <button
            id="modified-products-button"
            onClick={handleModifiedModalOpen}
          >
            <span className="m-2">
              <i className="fa-solid fa-sliders"></i>
            </span>
            <FormattedMessage id="modifiedProducts" />
          </button>

          <button id="delete-all-products-button" onClick={deleteAllProducts}>
            <span className="m-2">
              <i className="fa-solid fa-circle-xmark"></i>
            </span>
            <FormattedMessage id="deleteAllProducts" />
          </button>

          <button onClick={() => navigate("/dashboard")}>
            <span className="m-2">
              <i className="fa-solid fa-chart-line"></i>
            </span>
            Dashboard
          </button>
        </>
      )}

      <button id="chat-button" onClick={() => navigate("/chat")}>
        <span className="m-2">
          <i className="fa-solid fa-comment"></i>
        </span>
        <FormattedMessage id="Chat" />
      </button>
    </div>
  );
};

export default ProfileButtons;
