import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

function Dashboard() {
  const navigate = useNavigate();
  const [timeoutMinutes, setTimeoutMinutes] = useState("");
  const updateSessionTimeout = useAuthStore(
    (state) => state.updateSessionTimeout
  );

  const handleUpdateTimeout = () => {
    const minutes = parseInt(timeoutMinutes, 10);

    if (isNaN(minutes) || minutes <= 0) {
      alert("Por favor, insira um valor válido para o tempo de expiração.");
      return;
    }

    updateSessionTimeout(minutes, navigate);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  <i className="bi bi-house-door-fill me-2"></i> Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-people-fill me-2"></i> Users
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-gear-fill me-2"></i> Settings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#session-timeout">
                  <i className="bi bi-clock-fill me-2"></i> Session Timeout
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Dashboard</h1>
          </div>

          <div className="card mb-4" id="session-timeout">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Session Timeout</h5>
            </div>
            <div className="card-body">
              <p className="card-text">
                Configure o tempo limite da sessão para os usuários.
              </p>
              <div className="mb-3">
                <label htmlFor="timeoutInput" className="form-label">
                  Tempo de Expiração (em minutos)
                </label>
                <input
                  id="timeoutInput"
                  type="number"
                  className="form-control"
                  placeholder="Digite o tempo em minutos"
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleUpdateTimeout}>
                Configurar Session Timeout
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
