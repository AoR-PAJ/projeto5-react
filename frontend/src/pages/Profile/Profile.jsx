import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import UserInfo from "../../components/users/UserInfo/UserInfo";
import UserProductModal from "../../components/users/UserProductModal/UserProductModal";
import EditProfileModal from "../../components/users/EditProfileModal/EditProfileModal";
import UsersModal from "../../components/users/UsersModal/UsersModal";
import ModifiedProductsModal from "../../components/products/ModifiedProductsModal/ModifiedProductsModal";
import { Service } from "../../Services/Services";
import ProfileButtons from "../../components/buttons/ProfileButtons/ProfileButtons";
import UserProductStats from "../../components/users/UserProductStats/UserProductStats";

//Estilos
import "./Profile.css";
import { use } from "react";


function Profile() {
  //obtendo id a partir da url
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const usernameParam = useParams().username;
  const navigate = useNavigate();

  //credenciais do user cujo perfil se está a ver
  const username = useAuthStore((state) => state.username);
  const token = useAuthStore((state) => state.token);

  // Acessando os produtos da store
  const {
    products,
    fetchUserProducts,
    modifiedProducts,
    getModifiedProducts,
    setProducts,
  } = useProductStore();

  //armazena os dados do user conectado
  const [user, setUser] = useState(null);
  // armazena o perfil de outro usuário (caso seja um admin)
  const [userPerfil, setUserPerfil] = useState(null);

  //controla os erros
  const [error, setError] = useState(null);
  

  //controla a atualizacao do perfil do user
  const [refreshProfile, setRefreshProfile] = useState(false);

  //estados para controlar os modais
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModifiedProductsModalOpen, setIsModifiedProductsModalOpen] =
    useState(false);
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

  // Fazendo fetch dos dados do user
  useEffect(() => {
    if (!username) {
      setError("User not logged in");
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await Service.getUserData(username, token);
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [username, token]);

  // Fazendo fetch do perfil do usuário
  useEffect(() => {
    const fetchUserPerfil = async () => {
      try {
        const data = await Service.getUserProfile(usernameParam, token);
        setUserPerfil(data);
      } catch (error) {
        console.log("Erro ao obter perfil: ", error);
      }
    };

    fetchUserPerfil();
  }, [usernameParam, token, refreshProfile]);

  // Fazendo fetch dos produtos que pertencem ao dono do perfil usando a store
  useEffect(() => {
    if (usernameParam && token) {
      fetchUserProducts(usernameParam, token); // Usando a store para buscar os produtos
    }
  }, [usernameParam, token, fetchUserProducts]);

  // Produtos modificados
  useEffect(() => {
    if (isModifiedProductsModalOpen) {
      getModifiedProducts(token); // Agora utilizando a store para buscar os produtos modificados
      console.log("Produtos modificados no useEffect:", modifiedProducts);
    }
  }, [isModifiedProductsModalOpen, token, getModifiedProducts]);

  // Abrir modal com os produtos modificados
  const handleModifiedModalOpen = () => {
    setIsModifiedProductsModalOpen(true);
  };

  // Fechar modal com os produtos modificados
  const handleModifiedModalClosed = () => {
    setIsModifiedProductsModalOpen(false);
  };

  // Abrir modal de edição de perfil de user
  const handleModalOpen = () => {
    setEditUserData(userPerfil);
    setIsEditModalOpen(true);
  };

  // Fechar modal de edição de perfil de user
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

  // Capturar mudanças nos inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Inativar conta de um user
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

  if (error) {
    navigate("/homePage");
    return <div className="error">Error: {error}</div>;
  }

  // Editar Perfil
  const updateProfile = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      photoUrl,
      password,
      confirmPassword,
    } = editUserData;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!firstName || !lastName || !email || !phone || !photoUrl) {
      alert("Todos os campos são obrigatórios!");
      return; // Interrompe a execução se algum campo estiver vazio
    }

    // Verifica se as senhas coincidem, caso esteja atualizando a senha
    if (password && password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // Verifica se o telefone tem exatamente 9 dígitos
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("O número de telefone deve conter exatamente 9 dígitos.");
      return;
    }
    
    try {
      await useAuthStore
        .getState()
        .updateUserProfile(usernameParam, token, editUserData);

      //dá feedback sobre a atualizacao, atualiza os dados 
      alert("Perfil atualizado com sucesso!");
      setUserPerfil(editUserData);

      // Atualiza o estado de refresh para garantir a re-renderização necessária
      setRefreshProfile((prev) => !prev);
    } catch (error) {
      console.error(error.message);
      alert("Erro ao tentar atualizar o perfil");
    }
  };

  // Deletar todos os produtos de um user
  const deleteAllProducts = async () => {
    //apenas permite que o metodo avance caso o utilizador clique no botao de confirmar
    const confirmDelete = window.confirm(
      "Deseja mesmo apagar todos os produtos?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await Service.deleteAllProducts(usernameParam, token);
      alert("Todos os produtos foram deletados com sucesso!");
      setProducts([]); // Limpa a lista de produtos na store
    } catch (error) {
      console.error("Erro ao deletar os produtos:", error.message);
      alert("Erro ao deletar os produtos. Tente novamente.");
    }
  };

  // Reativar conta
  const reativarConta = async () => {
    try {
      await Service.reativarConta(usernameParam, token);
      alert("Conta reativada com sucesso!");

      // Re-fetch do perfil atualizado para garantir que as informações estejam corretas
      const data = await Service.getUserProfile(usernameParam, token);
      setUserPerfil(data);
    } catch (Error) {
      console.log("Erro ao reativar conta: ", Error);
    }
  };

  // Apagar conta
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


  return (
    <div>
      <main id="main-div">
        <div className="account-container">
          {/* Perfil do user */}
          <UserInfo userPerfil={userPerfil} />

          {/* Estatísticas dos produtos */}
          <UserProductStats username={usernameParam} token={token} />

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
        modifiedProducts={modifiedProducts || []}
      />
    </div>
  );
}

export default Profile;

