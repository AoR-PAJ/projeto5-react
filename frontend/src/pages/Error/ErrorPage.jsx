import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";

//Esta página será exibida caso uma rota que nao faça parte do router seja acessada
function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <img src="https://img.freepik.com/vetores-gratis/ups-erro-404-com-ilustracao-de-conceito-de-robo-quebrado_114360-5529.jpg" alt="error image" onClick={()=>navigate("/homePage")}/>
      
      <div>
        <h1>404 - Página não encontrada</h1>
        <p>A página que tentou acessar nao existe!</p>
      </div>
    </div>

  );
}

export default ErrorPage;