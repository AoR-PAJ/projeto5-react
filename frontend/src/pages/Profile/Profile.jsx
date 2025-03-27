//Import de bibliotecas
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

import UserInfo from "../../components/users/UserInfo/UserInfo";
import UserProductModal from "../../components/users/UserProductModal/UserProductModal";
import EditProfileModal from "../../components/users/EditProfileModal/EditProfileModal";
import UsersModal from "../../components/users/UsersModal/UsersModal";
import ModifiedProductsModal from "../../components/products/ModifiedProductsModal/ModifiedProductsModal";
import { Service } from "../../Services/Services";

//Estilos
import "./Profile.css";

function Profile() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const usernameParam = params.get("id");

  //variavel para permitir o redirecionamento
  const navigate = useNavigate();

  //criando estados para armazenar as informacoes do user
  const username = useAuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [userPerfil, setUserPerfil] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [modifiedProducts, setModifiedProducts] = useState([]);
  const [refreshProfile, setRefreshProfile] = useState(null);

  //Modal de produtos
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

  //Modal de perfil do user
  const [editUserData, setEditUserData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //Estado para exibir o modal dos produtos alterados
  const [isModifiedProductsModalOpen, setIsModifiedProductsModalOpen] =
    useState(false);

  //Estado para exibir o modal dos usuários
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Função para buscar todos os usuários cadastrados
  const getUsers = async (token) => {
    try {
      const data = await Service.fetchUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
    }
  };

  // Função para abrir o modal e carregar os usuários
  const handleUsersModalOpen = () => {
    getUsers(token);
    setIsUsersModalOpen(true);
  };

  // Função para fechar o modal
  const handleUsersModalClose = () => {
    setIsUsersModalOpen(false);
  };

  //Fazendo fetch dos dados do user
  useEffect(() => {
    if (!username) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await Service.getUserData(username, token);
        setUser(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData(); 
  }, [username, token]); 

  //Fazendo fetch dos dados do user que estou a consultar o perfil
  useEffect(() => {
    const fetchUserPerfil = async () => {
      try {
        const data = await Service.getUserProfile(usernameParam, token)
        setUserPerfil(data);
      } catch (error) {
        console.log("Erro ao obter perfil: ", error);
      }
    };

    fetchUserPerfil();
  }, [usernameParam, token, refreshProfile]);

  //Fazendo fetch dos produtos que pertencem ao dono do perfil
  useEffect(() => {
    if (usernameParam) {
      const fetcheUserProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/user/${usernameParam}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Erro ao obter produtos");
          }

          const productsData = await response.json();
          setProducts(productsData);
        } catch (Error) {
          console.error(error.message);
        }
      };

      fetcheUserProducts();
    }
  }, [usernameParam]);

  //Produtos modificados
  // Fetch Modified Products
  useEffect(() => {
    if (isModifiedProductsModalOpen) {
      const fetchModifiedProducts = async () => {
        try {
          const data = await Service.getModifiedProducts(token);
          setModifiedProducts(data);
        } catch (error) {
          console.error(error.message);
        }
      };

      fetchModifiedProducts();
    }
  }, [isModifiedProductsModalOpen, token]);

  //Abrir modal com os produtos modificados
  const handleModifiedModalOpen = () => {
    setIsModifiedProductsModalOpen(true);
  };

  //Fechar modal com os produtos modificados
  const handleModifiedModalClosed = () => {
    setIsModifiedProductsModalOpen(false);
  };

  //Abrir modal de edicao de perfil de user
  const handleModalOpen = () => {
    setEditUserData(userPerfil);
    setIsEditModalOpen(true);
  };

  //Fechar modal de edicao de perfil de user
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Abrir modal de produtos do usuário
  const handleOpenProductsModal = () => {
    setIsProductsModalOpen(true);
  };

  // Fechar modal de produtos
  const handleCloseProductsModal = () => {
    setIsProductsModalOpen(false);
  };

  //Capturar mudancas nos inputs
  // Função para capturar mudanças nos inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Funcoes relacionadas com os botoes de user
  //Inativar conta de um user
  const inativarConta = async () => {
    try {
      await Service.inactivateAccount(usernameParam, token);
      alert("Conta inativada com sucesso!");

      // Caso precise também atualizar o perfil do usuário
      const data = await Service.getUserProfile(usernameParam, token);
      setUserPerfil(data);
    } catch (error) {
      console.error("erro ao inativar conta", error.message);
    }
  };

  if (loading) {
    alert("Loading...");
    return <div className="error">Loading...</div>;
  }

  if (error) {
    alert("Sem utilizador logado. Será redirecionado para página principal.");
    navigate("/homePage");
    return <div className="error">Error: {error}</div>;
  }

  //Editar Perfil
  const updateProfile = async () => {
    try {
      const updatedUserData = await Service.updateUserProfile(
        usernameParam,
        token,
        editUserData
      );

      // Feedback de sucesso
      alert("Perfil atualizado com sucesso!");

      // Atualiza o estado com os novos dados do usuário
      setUserPerfil(updatedUserData);

      // Atualiza o estado de refresh para garantir a re-renderização necessária
      setRefreshProfile((prev) => !prev);
    } catch (error) {
      console.error(error.message);
      alert("Erro ao tentar atualizar o perfil");
    }
  };

  //Deletar todos os produtos de um user
  const deleteAllProducts = async () => {
    const confirmDelete = window.confirm(
      "Deseja mesmo apagar todos os produtos?"
    );

    if (!confirmDelete) {
      return; 
    }

    try {
      await Service.deleteAllProducts(usernameParam, token);
      alert("Todos os produtos foram deletados com sucesso!");
      setProducts([]);
    } catch (error) {
      console.error("Erro ao deletar os produtos:", error.message);
      alert("Erro ao deletar os produtos. Tente novamente.");
    }
  };

  //Reativar conta
  const reativarConta = async () => {
    try {
      await Service.reativarConta(usernameParam, token);
      alert("Conta reativada com sucesso!");

      // Re-fetch do perfil atualizado para garantir que as informações estejam corretas
      const data = await Service.getUserProfile(usernameParam, token);
      setUserPerfil(data); 
    } catch (Error) {
      console.log("Erro ao inativar conta: ", Error);
    }
  };

  //Apagar conta
  const apagarConta = async () => {
    const confirmDelete = window.confirm("Deseja mesmo apagar este user?");

    if (!confirmDelete) {
      return;
    }

    try {
      await Service.deleteUser(usernameParam, token);
      alert("Conta apagada com sucesso!");
      navigate("/homePage");
    } catch (Error) {
      console.log("Erro ao apagar conta: ", Error);
      alert("Erro ao apagar conta. Tente novamente.");
    }
  };

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

  return (
    <div>
      <main id="main-div">
        <div className="account-container">
          {/* Perfil do user */}
          <UserInfo userPerfil={userPerfil} />

          <ProfileButtons
            handleModalOpen={handleModalOpen}
            handleOpenProductsModal={handleOpenProductsModal}
            inativarConta={inativarConta}
            handleUsersModalOpen={handleUsersModalOpen}
            handleModifiedModalOpen={handleModifiedModalOpen}
            apagarConta={apagarConta}
            reativarConta={reativarConta}
            deleteAllProducts={deleteAllProducts}
            isAdmin={user?.admin}
          />
        </div>
      </main>

      {/* Modal de edição */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editUserData={editUserData}
        handleEditChange={handleEditChange}
        updateProfile={updateProfile}
      />

      {/* Modal de produtos */}
      <UserProductModal
        isOpen={isProductsModalOpen}
        onClose={handleCloseProductsModal}
        products={products}
      />

      {/* Modal com o link para o perfil dos users */}
      <UsersModal
        isOpen={isUsersModalOpen}
        onClose={handleUsersModalClose}
        users={users}
      />

      <ModifiedProductsModal
        isOpen={isModifiedProductsModalOpen}
        onClose={handleModifiedModalClosed}
        modifiedProducts={modifiedProducts}
      />
    </div>
  );
}

export default Profile;
