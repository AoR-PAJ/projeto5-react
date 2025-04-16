import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/useAuthStore";

import "./Logout.css";

const LogoutBtn = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const token = useAuthStore((state) => state.token);

  const handleLogout = async () => {

    if(token) {
      const success = await logout(token);

      if(success) {
        alert("Até a próxima!");
        navigate("/homePage");
      } else {
        alert("Erro ao realizar logout!");
      }
    }
   };

  //exibe o botao de logout apenas se o user estiver conectado
  if (username) {
    return (
      <>
        <button className="logout-btn" id="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="my-account-btn"
          onClick={() => navigate(`/users/${username}`)}
        >
          My Account
        </button>
      </>
    );
  } else {
    return (
      <div className="wrapper-btn">
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="registo-btn" onClick={() => navigate("/registo")}>
          Registar
        </button>
      </div>
    );
  }
};

export default LogoutBtn;
