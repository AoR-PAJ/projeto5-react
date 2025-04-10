import { use, useEffect, useState } from "react";
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

    updateSessionTimeout(minutes); 
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Users
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Settings
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

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Session Timeout</h5>
              <p className="card-text">
                Configure o tempo limite da sessão para os usuários.
              </p>
              <div className="mb-3">
                <input
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
