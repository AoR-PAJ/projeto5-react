import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
          <strong>
            <FormattedMessage id="registrationForm.firstName" />:
          </strong>{" "}
          {userPerfil?.firstName}
        </p>
        <p>
          <strong>
            <FormattedMessage id="registrationForm.lastname" />:
          </strong>{" "}
          {userPerfil?.lastName}
        </p>
        <p>
          <strong>
            <FormattedMessage id="inputUsername.text" />:
          </strong>{" "}
          {userPerfil?.username}
        </p>
        <p>
          <strong>Email:</strong> {userPerfil?.email}
        </p>
        <p>
          <strong>
            <FormattedMessage id="registrationForm.phone" />:
          </strong>{" "}
          {userPerfil?.phone}
        </p>
        <p>
          <strong>
            <FormattedMessage id="state" />:
          </strong>{" "}
          {userPerfil?.estado}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
