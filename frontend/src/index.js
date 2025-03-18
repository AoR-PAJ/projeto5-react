import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Registo from "./pages/Registo/Registo";
import HomePage from "./pages/HomePage/HomePage";

//importacao da biblioteca do font awesome
import "@fortawesome/fontawesome-free/css/all.min.css";
import ErrorPage from "./pages/Error/ErrorPage";
import MyAccount from "./pages/Perfil/MyAccount";
import CreateProduct from "./pages/CreateProduct/CreateProduct";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/my-account" element={<MyAccount/>} />
        <Route path="/create-product" element={<CreateProduct/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
