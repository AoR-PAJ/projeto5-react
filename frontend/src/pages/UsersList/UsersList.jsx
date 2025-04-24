import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Service } from "../../Services/Services";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";


function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const token = useAuthStore((state) => state.token);
  const intl = useIntl();

  // Função para buscar usuários filtrados
  const fetchFilteredUsers = async (search) => {
    try {
      const data = await Service.fetchFilteredUsers(search, token);
      setUsers(data); // Atualiza a lista de usuários com os resultados filtrados
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Atualiza o estado debouncedSearch com um atraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText); // Atualiza o texto com debounce
    }, 500); // Atraso de 500ms

    return () => clearTimeout(timer); // Limpa o timer anterior
  }, [searchText]);

  // Faz a requisição ao backend quando debouncedSearch muda
  useEffect(() => {
    if (debouncedSearch !== "") {
      fetchFilteredUsers(debouncedSearch);
    } else {
      fetchFilteredUsers(""); // Busca todos os usuários se o campo estiver vazio
    }
  }, [debouncedSearch]);

  // Filtra os usuários para exibir apenas os verificados
  const verifiedUsers = users.filter((user) => user.isVerified);

  return (
    <div className="container mt-4">
      <Breadcrumbs />
      {/* Título da página */}
      <h1 className="text-center mb-4 text-white">
        <FormattedMessage id="usersList.text" />
      </h1>

      {/* Campo de filtro */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder={intl.formatMessage({
              id: "filterByUsernameOrEmail.text",
            })}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="row">
        {users.map((user) => (
          <div
            key={user.username}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            style={{ cursor: "pointer" }}
          >
            <div
              className="card h-100 shadow-sm"
              onClick={() => navigate(`/users/${user.username}`)} // Redireciona para a página de perfil
              style={{ maxWidth: "150px", margin: "0 auto" }}
            >
              {/* Imagem do usuário */}
              <img
                src={user.photoUrl || "../../assets/general-profile.jpg"} // Foto do usuário ou imagem padrão
                className="card-img-top"
                alt={`perfil de ${user.username}`}
                style={{ height: "120px", objectFit: "cover" }}
              />
              {/* Conteúdo do card */}
              <div className="card-body">
                <h5
                  className="card-title text-center"
                  style={{ fontSize: "0.9rem" }}
                >
                  {user.username}
                </h5>
                <p
                  className="card-text text-center"
                  style={{ fontSize: "0.8rem" }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
