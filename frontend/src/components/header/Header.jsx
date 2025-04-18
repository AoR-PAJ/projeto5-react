import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import LogoutBtn from "../buttons/logout/Logout";
import HomeButton from "../buttons/HomeButton/HomeButton";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// Componente que exibe as informações no cabeçalho com username e imagem
const Header = () => {
  const username = useAuthStore((state) => state.username);
  const profilePicture = useAuthStore((state) => state.profilePicture);
  const navigate = useNavigate();

  // Constantes para a linguagem do site
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);

  return (
    <header className="container-fluid  text-white py-3">
      <div className="container">
        <div className="row align-items-center">
          {/* Botão Home */}
          <div className="col-6 col-md-4 d-flex align-items-center">
            <HomeButton />
          </div>

          {/* Boas-vindas e imagem do usuário */}
          <div className="col-6 col-md-4 text-center">
            {username && (
              <span id="display-username" className="display-username">
                <FormattedMessage id="header.welcome" />,{" "}
                <a
                  className="profile-link text-white text-decoration-none"
                  onClick={() => navigate(`/users/${username}`)}
                  style={{ cursor: "pointer" }}
                >
                  {username}
                </a>
              </span>
            )}
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile picture"
                className="rounded-circle ms-2"
                style={{ width: "50px", height: "50px" }}
              />
            )}
          </div>

          {/* Logout e troca de idioma */}
          <div className="col-12 col-md-4 text-end mt-3 mt-md-0">
            <div className="d-flex justify-content-end align-items-center">
              <LogoutBtn />
              <div id="language-switcher" className="ms-3">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => setLanguage(e.target.value)}
                  value={language}
                >
                  <option value="en">EN</option>
                  <option value="pt">PT</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
