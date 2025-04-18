import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InputField from "../../components/forms/InputField/InputField";
import { useNavigate } from "react-router-dom";
import { Service } from "../../Services/Services";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";

const ResetPassword = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem. Tente novamente.");
      return;
    }

    try {
      const response = await Service.updatePassword(token, password);
      if (response.status === 200) {
        setMessage("Senha redefinida com sucesso!");
      } else if (response.status === 400) {     
        setMessage("Token inválido ou expirado.");
      } else if(response.status === 403) {
        setMessage("Conta não verificada.");
      } else {
        setMessage("Erro ao redefinir a senha. Tente novamente.");   
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <Breadcrumbs />
        <h3 className="text-center mb-4">
          <FormattedMessage id="resetPassword.text" />
        </h3>
        <form onSubmit={handleSubmit}>
          <InputField
            label={intl.formatMessage({ id: "newPassword.text" })}
            type="password"
            id="password"
            name="password"
            maxLength="50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputField
            label={intl.formatMessage({ id: "confirmNewPassword.text" })}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            maxLength="50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100 mt-3">
            <FormattedMessage id="resetPassword.text" />
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate("/homePage")}
          >
            <FormattedMessage id="homeButton.text" />
          </button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
