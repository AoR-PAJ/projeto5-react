
import React from "react";
import { useNavigate } from "react-router-dom";

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
        Edit Information
      </button>

      <button id="products-button" onClick={handleOpenProductsModal}>
        My Products
      </button>

      <button id="inactivate-account-button" onClick={inativarConta}>
        Inactivate Account
      </button>

      {/* exibicao dos botoes com opcao para admin */}
      {isAdmin && (
        <>
          <button id="reactivate-account-button" onClick={reativarConta}>
            Reactivate Account
          </button>

          <button id="delete-user-button" onClick={apagarConta}>
            Delete User
          </button>

          <button id="edit-user-button" onClick={()=>navigate("/users-list")}>
            Edit Users
          </button>

          <button
            id="modified-products-button"
            onClick={handleModifiedModalOpen}
          >
            Modified Products
          </button>

          <button id="delete-all-products-button" onClick={deleteAllProducts}>
            Delete All Products
          </button>

          <button onClick={()=>navigate("/dashboard")}>
            Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileButtons;
