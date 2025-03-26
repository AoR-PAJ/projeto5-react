import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuthStore } from "../../../stores/UseAuthStore"
import InputField from "../InputField/InputField";
import { Service } from "../../../Services/Services";

function LoginForm() {
  const navigate = useNavigate();
  const updateName = UseAuthStore((state) => state.updateName);
  const updatePhoto = UseAuthStore((state) => state.updatePhoto);
  const updateAdmin = UseAuthStore((state) => state.updateAdmin);

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
      const token = await Service.loginUser(inputs.username, inputs.password);
      sessionStorage.setItem("token", token);

      // Buscando os dados do usuário com o token
      const userData = await Service.getUserData(inputs.username, token);

      // Atualizando os dados do usuário no estado global
      updateName(userData.username);
      updatePhoto(userData.photoUrl);
      updateAdmin(userData.admin);

      alert("Bem-vindo " + userData.username);
      navigate("/homePage");
    } catch (error) {
      alert(error.message); // Exibindo erro caso algo falhe
      setInputs({ username: "", password: "" });
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <InputField
        label="Username"
        type="text"
        id="username"
        name="username"
        placeholder="Insert your username"
        value={inputs.username}
        onChange={handleChange}
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        name="password"
        placeholder="Insert your password"
        value={inputs.password}
        onChange={handleChange}
        required
      />
      <div className="buttons">
        <input type="submit" value="Sign In" className="btn-signin" />
        <button type="button" className="btn-signup" onClick={registar}>
          Sign up
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
