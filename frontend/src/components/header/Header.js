import React from "react";

const Header = ({username, profilePicture}) => {
  return (
    <div id="header-div">
      <div id="welcome-div">
        <p id="welcome-note">
          <span id="display-username">{username}</span>
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