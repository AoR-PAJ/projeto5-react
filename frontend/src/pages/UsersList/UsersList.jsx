import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Service } from "../../Services/Services";

function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const token = useAuthStore((state) => state.token);
  
  useEffect(()=> {
    const fetchUsers = async () => {
      try {
        const data = await Service.fetchUsers(token);
        setUsers(data);
      } catch(error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      {/* Título da página */}
      <h1 className="text-center mb-4 text-white">Lista de Usuários</h1>

      {/* Campo de filtro */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por username ou email"
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
