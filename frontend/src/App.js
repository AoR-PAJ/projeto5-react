import React from 'react';
import './App.css';
import Header from "../src/components/header/Header";

function App() {
  return (
    <div className='App' id ="outer-container">
      <div className='page-wrap' id="app-page-wrap">
        <Header username = "Usuário 1" profilePicture="https://marketplace.canva.com/EAFvwOp_LqM/1/0/1600w/canva-foto-de-perfil-para-linkedin-redondo-simples-degrad%C3%AA-preto-e-azul-escuro-frpVriKbKbM.jpg"/>
        <h1>Welcome to the website</h1> 
        
      </div>
    </div>
  );
}

export default App;
