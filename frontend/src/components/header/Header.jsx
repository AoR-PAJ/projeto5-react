import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import LogoutBtn from "../buttons/logout/Logout";
import HomeButton from "../buttons/HomeButton/HomeButton";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

//componente que exibe as informacoes no cabecalho com username e imagem
const Header = () => {
  const username = useAuthStore((state) => state.username);
  const profilePicture = useAuthStore((state) => state.profilePicture);
  const navigate = useNavigate();

  //constantes para a linguagem do site
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);


  return (
    <div id="header-div">
      <div id="welcome-div">
        <div id="welcome-note" className="welcome-note">
          <div className="user-info">
            <HomeButton />
            {username && (
              <span id="display-username" className="display-username">
                {/* Exibe o texto traduzido */}
                <FormattedMessage id="header.welcome" />,{" "}
                <a
                  className="profile-link"
                  onClick={() => navigate(`/users/${username}`)}
                >
                  {username}
                </a>
              </span>
            )}

            <span id="display-picture" className="display-picture">
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile picture"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              )}
            </span>
          </div>

          <span>
            <LogoutBtn />
          </span>

          {/* Select para troca de idioma */}
          <div id="language-switcher" className="language-switcher">
            <select
              className="form-select form-select-sm"
              onChange={(e) => setLanguage(e.target.value)}
              value = {language}  
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
            </select>
          </div>
        </div>
      </div>

      <div id="nav-div"></div>
    </div>
  );
};

export default Header;
