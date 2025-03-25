import React from "react";

const UserInfo = ({ userPerfil }) => {
  return (
    <div id="account-info">
      <img
        className="profile-photo"
        id="user-photo"
        src={userPerfil?.photoUrl || "img/default-photo.png"}
        alt="User Photo"
      />
      <div id="account-text">
        <p>
          <strong>First Name:</strong> {userPerfil?.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {userPerfil?.lastName}
        </p>
        <p>
          <strong>Username:</strong> {userPerfil?.username}
        </p>
        <p>
          <strong>Email:</strong> {userPerfil?.email}
        </p>
        <p>
          <strong>Phone:</strong> {userPerfil?.phone}
        </p>
        <p>
          <strong>Status:</strong> {userPerfil?.estado}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
