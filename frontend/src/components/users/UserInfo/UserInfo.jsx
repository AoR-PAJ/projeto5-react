import React from "react";
import { FormattedMessage } from "react-intl";

const UserInfo = ({ userPerfil }) => {
  return (
    <div className=" p-4">
      <div className="row align-items-center">
        {/* Foto do usuário */}
        <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
          <img
            className="rounded-circle img-fluid shadow"
            src={userPerfil?.photoUrl || "img/default-photo.png"}
            alt="User Photo"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>

        {/* Informações do usuário */}
        <div className="col-12 col-md-8">
          <p className="mb-2">
            <strong>
              <FormattedMessage id="registrationForm.firstName" />:
            </strong>{" "}
            {userPerfil?.firstName}
          </p>
          <p className="mb-2">
            <strong>
              <FormattedMessage id="registrationForm.lastname" />:
            </strong>{" "}
            {userPerfil?.lastName}
          </p>
          <p className="mb-2">
            <strong>
              <FormattedMessage id="inputUsername.text" />:
            </strong>{" "}
            {userPerfil?.username}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {userPerfil?.email}
          </p>
          <p className="mb-2">
            <strong>
              <FormattedMessage id="registrationForm.phone" />:
            </strong>{" "}
            {userPerfil?.phone}
          </p>
          <p className="mb-0">
            <strong>
              <FormattedMessage id="state" />:
            </strong>{" "}
            {userPerfil?.estado}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
