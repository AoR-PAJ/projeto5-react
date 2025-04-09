import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InputField from "../../components/forms/InputField/InputField";

const ResetPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/auth/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (response.ok) {
        setMessage(
          "Um link para redefinir sua senha foi enviado para o e-mail associado."
        );
      } else {
        setMessage(
          "Erro ao processar o pedido. Verifique o username e tente novamente."
        );
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Redefinir Senha</h3>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            id="username"
            name="username"
            maxLength="50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Enviar
          </button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
