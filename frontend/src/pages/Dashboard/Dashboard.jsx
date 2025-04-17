import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { Service } from "../../Services/Services";
import UserStatus from "./UserStatus";
import { FormattedMessage, useIntl } from "react-intl";
import CategoryStatus from "./CategoryStatus";
import UserProductStats from "./UserProductStats";

function Dashboard() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [timeoutMinutes, setTimeoutMinutes] = useState("");
  const [sessionExpiration, setSessionExpiration] = useState(null);
  const [openSection, setOpenSection] = useState(null); // Estado para rastrear a seção aberta
  const updateSessionTimeout = useAuthStore(
    (state) => state.updateSessionTimeout
  );

  // Função para buscar o valor de sessionExpiration
  const fetchExpiration = async () => {
    try {
      const expiration = await Service.getSessionTimeout();
      setSessionExpiration(expiration.sessionExpirationMinutes);
    } catch (error) {
      console.error("Erro ao buscar o tempo de expiração:", error);
    }
  };

  // Atualiza o sessionExpiration ao carregar o componente
  useEffect(() => {
    fetchExpiration();
  }, []);

  // Atualiza o sessionExpiration e limpa o input após alterar o timeout
  const handleUpdateTimeout = async () => {
    const minutes = parseInt(timeoutMinutes, 10);

    if (isNaN(minutes) || minutes <= 0) {
      alert("Por favor, insira um valor válido para o tempo de expiração.");
      return;
    }

    try {
      await updateSessionTimeout(minutes, navigate); // Atualiza o timeout no backend
      setTimeoutMinutes(""); // Limpa o campo de entrada
      fetchExpiration(); // Recarrega o valor de sessionExpiration
    } catch (error) {
      console.error("Erro ao atualizar o tempo de expiração:", error);
    }
  };

  // Função para alternar a seção aberta
  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => toggleSection("userStatus")}
                >
                  <i className="bi bi-people-fill me-2"></i>{" "}
                  <FormattedMessage id="users" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => toggleSection("categories")}
                >
                  <i className="bi bi-gear-fill me-2"></i>{" "}
                  <FormattedMessage id="categories" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => toggleSection("sessionTimeout")}
                >
                  <i className="bi bi-clock-fill me-2"></i>{" "}
                  <FormattedMessage id="timeout" />
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => toggleSection("userProductStats")}
                >
                  <i className="bi bi-bar-chart me-2"></i>{" "}
                  <FormattedMessage
                    id="userproductstats"
                    defaultMessage="User Product Stats"
                  />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2 text-white">
              <FormattedMessage id="adminDashboard" />
            </h1>
          </div>

          {/* User Status Card */}
          <div className="card mb-4">
            <div
              className="card-header bg-primary text-white"
              onClick={() => toggleSection("userStatus")}
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title mb-0">
                <FormattedMessage id="userstatistics" />
              </h5>
            </div>
            {openSection === "userStatus" && ( // Renderiza o conteúdo apenas se a seção estiver aberta
              <div className="card-body">
                <UserStatus />
              </div>
            )}
          </div>

          {/* Category Status Card */}
          <div className="card mb-4">
            <div
              className="card-header bg-success text-white"
              onClick={() => toggleSection("categories")}
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title mb-0">
                <FormattedMessage id="categorystatistics" />
              </h5>
            </div>
            {openSection === "categories" && ( // Renderiza o conteúdo apenas se a seção estiver aberta
              <div className="card-body">
                <CategoryStatus />
              </div>
            )}
          </div>

          {/* Session Timeout Card */}
          <div className="card mb-4">
            <div
              className="card-header bg-warning text-dark"
              onClick={() => toggleSection("sessionTimeout")}
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title mb-0">
                <FormattedMessage id="sessinTimeout" />
              </h5>
            </div>
            {openSection === "sessionTimeout" && ( // Renderiza o conteúdo apenas se a seção estiver aberta
              <div className="card-body">
                <p className="card-text">
                  <FormattedMessage id="sessinTimeout.description" />
                </p>
                <div className="mb-3">
                  <strong>
                    <FormattedMessage id="sessinTimeout" />:
                  </strong>{" "}
                  {sessionExpiration !== null
                    ? `${sessionExpiration} minutos`
                    : "Carregando..."}
                </div>
                <div className="mb-3">
                  <input
                    id="timeoutInput"
                    type="number"
                    className="form-control"
                    placeholder={intl.formatMessage({
                      id: "sessionTimeout.placeholder",
                    })}
                    value={timeoutMinutes}
                    onChange={(e) => setTimeoutMinutes(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateTimeout}
                >
                  <FormattedMessage id="setSessionTimeout" />
                </button>
              </div>
            )}
          </div>

          {/* User Product Stats Card */}
          <div className="card mb-4">
            <div
              className="card-header bg-info text-white"
              onClick={() => toggleSection("userProductStats")}
              style={{ cursor: "pointer" }}
            >
              <h5 className="card-title mb-0">
                <FormattedMessage
                  id="userproductstats.title"
                  defaultMessage="User Product Statistics"
                />
              </h5>
            </div>
            {openSection === "userProductStats" && (
              <div className="card-body">
                <UserProductStats />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
