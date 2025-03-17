import React from "react";
import { userStore } from "../../stores/UserStore";
import "./Header.css";

const Header = () => {
  const username = userStore((state) => state.username);
  const profilePicture = userStore((state) => state.profilePicture);
  
  return (
    <div id="header-div">
      <div id="welcome-div">
        <p id="welcome-note">
          <span id="display-username">Welcome, {username}</span>
          <span id="display-picture">
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile picture"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
          </span>
        </p>
      </div>
      <div id="nav-div"></div>
    </div>
  );
}

export default Header;