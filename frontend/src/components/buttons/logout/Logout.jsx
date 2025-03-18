import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "../../../stores/AuthStore";

import "./Logout.css";


const LogoutBtn = ()=> {
  const navigate = useNavigate();
  const logout = AuthStore((state) => state.logout); 
  const username = AuthStore((state) => state.username);

  const handleLogout = () => {
    const token = sessionStorage.getItem("token");

    if(token) {
      fetch("http://localhost:8080/vanessa-vinicyus-proj3/rest/users/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Passando o token para o backend
          "Accept": "application/json",
        },
      })
      .then((response) => {
        if(response.status === 200) {
          sessionStorage.removeItem("token");

          //atualiza o estado global
          logout();

          //feedback
          alert("Até a próxima!")

          //redireciona
          navigate("/homePage");
        } else {
          alert("Erro ao fazer logout!")
        }
      })
      .catch((error) => {
        console.error("Erro ao realizar logout ", error);
        alert("Ocorreu um erro, tente novamente.");
      })    
    }
  }

  //exibe o botao de logout apenas se o user estiver conectado
  if(username) {
    return(
      <>
        <button className="logout-btn" id="logout-btn" onClick={handleLogout}>Logout</button>
        <button className="my-account-btn" onClick={()=>navigate("/my-account")}>My Account</button>
      </>
    );
  } else {
    return(
      <div className="wrapper-btn">
        <button className="login-btn" onClick={()=> navigate("/login")}>Login</button>
        <button className="registo-btn" onClick={()=>navigate("/registo")}>Registar</button>
      </div>
    )
  }
}

export default LogoutBtn;
