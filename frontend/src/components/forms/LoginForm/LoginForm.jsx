import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuthStore } from "../../../stores/UseAuthStore"
import InputField from "../InputField/InputField";

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

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`http://localhost:8080/vanessa-vinicyus-proj3/rest/users/login`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-type": "application/json",
      },
      body: JSON.stringify(inputs),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        } else if (response.status === 403) {
          alert("Conta inativa. Credenciais rejeitadas.");
          return Promise.reject("Conta inativa");
        } else {
          alert("Credenciais inválidas!");
          return Promise.reject("Credenciais inválidas");
        }
      })
      .then((token) => {
        sessionStorage.setItem("token", token);
        return fetch(
          `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${inputs.username}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      })
      .then((response) => response.json())
      .then((userData) => {
        updateName(userData.username);
        updatePhoto(userData.photoUrl);
        updateAdmin(userData.admin);
        alert("Bem vindo " + userData.username);
        navigate("/homePage");
      })
      .catch(() => {
        setInputs({ username: "", password: "" });
      });
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
