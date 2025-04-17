import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "bootstrap/dist/css/bootstrap.min.css";
import InputField from "../../components/forms/InputField/InputField";
import { useNavigate } from "react-router-dom";
import { Service } from "../../Services/Services";


const ResetPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const intl = useIntl();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!username.trim()){  
      alert("O campo username é obrigatório!");
      return;
    }

    try {
      const response = await Service.resetPassword(username);

      if(response) {
        setMessage("Um e-mail foi enviado com as instruções para redefinir sua senha.");
      } else {
        setMessage(
          "Um e-mail foi enviado com as instruções para redefinir sua senha."
        );
      }
    } catch(error) {
      setMessage(error.message || "Erro ao processar o pedido.");
    }

  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          <FormattedMessage id="changePassword.text" />
        </h3>
        <form onSubmit={handleSubmit}>
          <InputField
            label={intl.formatMessage({ id: "informUsername" })}
            type="text"
            id="username"
            name="username"
            maxLength="50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100 mt-3">
            <FormattedMessage id="sendButton.text" />
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

export default ResetPasswordPage;
