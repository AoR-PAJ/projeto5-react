import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import LogoutBtn from "../buttons/logout/Logout";
import HomeButton from "../buttons/HomeButton/HomeButton";
import "./Header.css";
import { useNavigate } from "react-router-dom";

//componente que exibe as informacoes no cabecalho com username e imagem
const Header = () => {
  const username = useAuthStore((state) => state.username);
  const profilePicture = useAuthStore((state) => state.profilePicture);
  const navigate = useNavigate();

  return (
    <div id="header-div">
      <div id="welcome-div">
        <div id="welcome-note" className="welcome-note">
          <div className="user-info"> 
            <HomeButton />
            {username && (
              <span id="display-username" className="display-username">
                Welcome,{" "}
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
        </div>
      </div>
      <div id="nav-div"></div>
    </div>
  );
};

export default Header;
