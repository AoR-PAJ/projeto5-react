//Import de bibliotecas
import React, { useState, useEffect } from "react";
import { AuthStore } from "../../stores/AuthStore";
import { useNavigate } from "react-router-dom";

//Estilos
import "./MyAccount.css";

function MyAccount() {
  //variavel para permitir o redirecionamento
  const navigate = useNavigate();

  //criando estados para armazenar as informacoes do user
  const username = AuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  //Modal de produtos
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

  //Modal de perfil do user
  const [editUserData, setEditUserData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //Fazendo fetch dos dados do user
  useEffect(() => {
    if (!username) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${username}`
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setUser(data); // Armazenando os dados do usuário no estado
      } catch (err) {
        setError(err.message); // Definindo mensagem de erro, caso ocorra
      } finally {
        setLoading(false); // Finalizando o carregamento
      }
    };

    fetchUserData();
  }, [username, token]);

  //Fazendo fetch dos produtos que foram criados pelo user logado
  useEffect(() => {
    if (user) {
      const fetcheUserProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/user/${username}`,
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
  }, [user]);

  //Abrir modal de edicao de perfil de user
  const handleModalOpen = () => {
    setEditUserData(user);
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

  //Funcao que faz o fetch para atualizar o perfil do user
  const handleUpdateUser = () => {
    console.log("dados atualizados");
  };

  //Funcoes relacionadas com os botoes de user
  //Inativar minha conta
  const inativarConta = async () => {
    const url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${username}/inativarConta`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Passando o token para o backend
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao inativar conta.");
      }

      //feedback de inativaçao
      alert("Conta inativada com sucesso!");

      //realizando logout da conta
      AuthStore.getState().logout();

      //redirecionar para a página de resgisto
      navigate("/registo");
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
    const url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${username}`;

    const requestBody = {
      firstName: editUserData.firstName || user.firstName, 
      lastName: editUserData.lastName || user.lastName,
      email: editUserData.email || user.email,
      phone: editUserData.phone || user.phone,
      photoUrl: editUserData.photoUrl || user.photoUrl,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if(response.ok) {
        alert("Perfil atualizado com sucesso!");
      } else {
        alert("Erro ao tentar atualizar o perfil");
      }
    } catch (error) {
      console.error(error.message);
    }
    
    
  };

  return (
    <div>
      <main id="main-div">
        <div className="account-container">
          <div id="account-info">
            <img
              className="profile-photo"
              id="user-photo"
              src={user?.photoUrl || "img/default-photo.png"}
              alt="User Photo"
            />
            <div id="account-text">
              <p>
                <strong>First Name:</strong> {user?.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user?.lastName}
              </p>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone}
              </p>
            </div>
          </div>
          <div className="button-container">
            <button id="edit-button" onClick={handleModalOpen}>
              Edit Information
            </button>

            {/*MODAL DE EDICAO DE DADOS DO PERFIL*/}

            {/* Modal de Edição de perfil */}
            {isEditModalOpen && (
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

                    {/* <label> Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editUserData.password || ""}
                      onChange={handleEditChange}
                      placeholder="Deixe em branco caso não queira alterar"
                    /> */}

                    <div className="button-group">
                      <button
                        type="button"
                        className="save-button"
                        onClick={updateProfile}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={handleCloseEditModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <button id="products-button" onClick={handleOpenProductsModal}>
              My Products
            </button>
            <button id="inactivate-account-button" onClick={inativarConta}>
              Inactivate Account
            </button>

            {/*exibicao do modal com as informacoes dos produtos do user*/}
            {isProductsModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h2>My Products</h2>
                  {products.length > 0 ? (
                    <div id="products-div">
                      <div className="tableProdutos">
                        <div className="cards">
                          {products.map((product) => (
                            <div key={product.id} className="product-card">
                              <div className="card-item">
                                <a href={`product-details?id=${product.id}`}>
                                  <img
                                    src={product.picture}
                                    alt={product.title}
                                    className="product-image"
                                  />
                                  <div className="product-info">
                                    <p className="categoryProduct">
                                      {product.category}
                                    </p>
                                    <p className="nomeProduct">
                                      {product.title}
                                    </p>
                                    <p className="precoProduct">
                                      {product.price}€
                                    </p>
                                  </div>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No products available.</p>
                  )}
                  <button onClick={handleCloseProductsModal}>Close</button>
                </div>
              </div>
            )}

            {/* botoes exclusivos do admin apenas sao exibidos caso o user logado tenha as permissoes*/}
            {user?.admin && (
              <>
                <button id="edit-user-button">Edit User</button>
                <button id="modified-products-button">Modified Products</button>
                <button id="inactive-products-button">Inactive Products</button>
                <button id="delete-user-button">Delete User</button>
                <button id="reactivate-account-button">
                  Reactivate Account
                </button>
                <button id="delete-all-products-button">
                  Delete All Products
                </button>
              </>
            )}
          </div>
        </div>

        <div id="edit-form" style={{ display: "none" }}>
          <h3>Edit Your Information</h3>
          <form id="update-form">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" maxLength="15" />

            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" maxLength="15" />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" maxLength="30" />

            <label htmlFor="phone">Phone:</label>
            <input type="text" id="phone" name="phone" maxLength="9" />

            <label htmlFor="photoUrl">Photo URL:</label>
            <input type="text" id="photoUrl" name="photoUrl" />

            <label htmlFor="estado">Estado:</label>
            <select id="estado" name="estado">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              maxLength="15"
            />

            <button type="submit" id="save-changes">
              Save Changes
            </button>
            <button type="button" id="cancel-edit">
              Cancel
            </button>
          </form>
        </div>

        <div id="user-list-form" style={{ display: "none" }}>
          <h3>Select a User to Edit</h3>
          <ul id="user-list"></ul>
          <button type="button" id="cancel-user-list">
            Cancel
          </button>
        </div>

        <div id="product-list-form" style={{ display: "none" }}>
          <h3 id="modified"> </h3>

          <ul id="product-list"></ul>
          <button type="button" id="cancel-product-list">
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}

export default MyAccount;
