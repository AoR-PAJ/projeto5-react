import { useNavigate } from "react-router-dom";

function UsersList() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Titulo da página */}
      <h1 className="text-center mb-4 text-white">Lista de Usuários</h1>

      {/* Filtro */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por username ou email"
          />
        </div>
      </div>

      {/* Cards com os users */}
      <div className="row">
        <div
          key={"admin"}
          className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          style={{ cursor: "pointer" }}
        >
          <div
            className="card h-100 shadow-sm"
            onClick={() => navigate(`/users/admin`)}
            style={{ maxWidth: "150px", margin: "0 auto" }} // Reduz a largura máxima do card
          >
            {/* Imagem do usuário */}
            <img
              src="../../assets/general-profile.jpg"
              className="card-img-top"
              alt={`perfil de admin`}
              style={{ height: "120px", objectFit: "cover" }} // Reduz a altura da imagem
            />
            {/* Conteúdo do card */}
            <div className="card-body">
              <h5
                className="card-title text-center"
                style={{ fontSize: "0.9rem" }} // Reduz o tamanho da fonte do título
              >
                admin
              </h5>
              <p
                className="card-text text-center"
                style={{ fontSize: "0.8rem" }} // Reduz o tamanho da fonte do texto
              >
                email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
