import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UseAuthStore } from "../../stores/UseAuthStore";

function Login() {
  const updateName = UseAuthStore((state) => state.updateName);
  const updatePhoto = UseAuthStore((state) => state.updatePhoto);
  const updateAdmin = UseAuthStore((state) => state.updateAdmin);

  //redirecionamento para a pagina de registo
  const navigate = useNavigate();
  const registar = () => {
    navigate("/registo");
  };

  //armazenando os inputs do formulario nas variaveis
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  //funcao que captura os inputs conforme o user as insere
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //faz fetch para executar o login
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
          alert("credenciais inválidas!");
          return Promise.reject("credenciais inválidas");
        }
      })
      .then((token) => {
        //armazena no session storage o token da sessao
        sessionStorage.setItem("token", token);

        //fetch do user logado para obter a informacao da foto
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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject("Erro ao buscar informações do usuário");
        }
      })
      .then((userData) => {
        //atualiza o username, imagem e permissao de admin
        updateName(userData.username);
        updatePhoto(userData.photoUrl);
        updateAdmin(userData.admin);

        //exibe mensagem de feedback e redireciona para a página
        alert("Bem vindo " + userData.username);

        navigate("/homePage");
      })
      .catch((error) => {
        setInputs({
          username: "",
          password: "",
        });
      });
  };

  return (
    <div className="Login" id="login-outer-container">
      <div className="page-wrap" id="login-page-wrap">
        <main id="main-div" className="clearfix">
          <div className="login-form">
            <a href="homePage">
              <img src="./assets/lettering.png" alt="lettering" height="180" />
            </a>

            <form id="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Insert your username"
                  value={inputs.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Insert your password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="buttons">
                <input type="submit" value="Sign In" className="btn-signin" />
                <button type="button" className="btn-signup" onClick={registar}>
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
