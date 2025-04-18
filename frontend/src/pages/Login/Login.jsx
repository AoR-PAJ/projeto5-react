import React from "react";
import "./Login.css";
import LoginForm from "../../components/forms/LoginForm/LoginForm";

function Login() {
  return (
    <div className="Login container-fluid d-flex align-items-center justify-content-center vh-100" id="login-outer-container">
      <div className="page-wrap text-center" id="login-page-wrap">
        <main className="clearfix">
          <div className="login-form">
            <a href="homePage">
              <img
                src="./assets/lettering.png"
                alt="lettering"
                className="img-fluid mb-4"
                style={{ maxHeight: "180px" }}
              />
            </a>
            {/* Formulário de login */}
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;