import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/useAuthStore";
import InputField from "../InputField/InputField";
import { Service } from "../../../Services/Services";

function LoginForm() {
  const intl = useIntl();
  const navigate = useNavigate();
  const updateName = useAuthStore((state) => state.updateName);
  const updatePhoto = useAuthStore((state) => state.updatePhoto);
  const updateAdmin = useAuthStore((state) => state.updateAdmin);
  const login = useAuthStore((state) => state.login);

  const registar = () => {
    navigate("/registo");
  };

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fazendo login e obtendo o token
      const result = await Service.loginUser(inputs.username, inputs.password);

      if (result.success) {
        const { token, sessionExpirationMinutes } = result;

        // Configurando o login e a expiração da sessão
        login(token, sessionExpirationMinutes);

        // Buscando os dados do usuário com o token
        const userData = await Service.getUserData(inputs.username, token);
        // Atualizando os dados do usuário no estado global
        updateName(userData.username);
        updatePhoto(userData.photoUrl);
        updateAdmin(userData.admin);
        alert("Bem-vindo " + userData.username);
        navigate("/homePage");
      } else {
        alert(result.message);
        setInputs({ username: "", password: "" });
      }
    } catch (error) {
      alert(error.message); // Exibindo erro caso algo falhe
      setInputs({ username: "", password: "" });
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <InputField
        label={intl.formatMessage({
          id: "inputUsername.text",
        })}
        type="text"
        id="username"
        name="username"
        placeholder={intl.formatMessage({
          id: "inputUsername.text",
        })}
        value={inputs.username}
        onChange={handleChange}
        required
      />
      <InputField
        label={intl.formatMessage({
          id: "inputPassword.text",
        })}
        type="password"
        id="password"
        name="password"
        placeholder="Insert your password"
        value={inputs.password}
        onChange={handleChange}
        required
      />
      <div className="buttons">
        <input
          type="submit"
          value={intl.formatMessage({
            id: "signin.text",
          })}
          className="btn-signin"
        />
        <button type="button" className="btn-signup" onClick={registar}>
          <FormattedMessage id="signup.text" />
        </button>
      </div>
      <div>
        <a href="/forgot-password" className="forgot-password">
          <FormattedMessage id="forgotPassword.text" />
        </a>
      </div>
    </form>
  );
}

export default LoginForm;
