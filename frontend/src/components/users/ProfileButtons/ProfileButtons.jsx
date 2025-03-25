import React from "react";

// Componente para os botões
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
  return (
    <div className="button-container">
      <button id="edit-button" onClick={handleModalOpen}>
        Edit Information
      </button>

      <button id="products-button" onClick={handleOpenProductsModal}>
        My Products
      </button>

      <button id="inactivate-account-button" onClick={inativarConta}>
        Inactivate Account
      </button>

      {/* Exibir botões apenas para admin */}
      {isAdmin && (
        <>
          <button id="edit-user-button" onClick={handleUsersModalOpen}>
            Edit Users
          </button>

          <button
            id="modified-products-button"
            onClick={handleModifiedModalOpen}
          >
            Modified Products
          </button>

          <button id="delete-user-button" onClick={apagarConta}>
            Delete User
          </button>

          <button id="reactivate-account-button" onClick={reativarConta}>
            Reactivate Account
          </button>

          <button id="delete-all-products-button" onClick={deleteAllProducts}>
            Delete All Products
          </button>
        </>
      )}
    </div>
  );
};
