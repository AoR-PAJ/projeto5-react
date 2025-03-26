import React from "react";
import "./Login.css";
import LoginForm from "../../components/forms/LoginForm/LoginForm";

function Login() {
  return (
    <div className="Login" id="login-outer-container">
      <div className="page-wrap" id="login-page-wrap">
        <main id="main-div" className="clearfix">
          <div className="login-form">
            <a href="homePage">
              <img src="./assets/lettering.png" alt="lettering" height="180" />
            </a>
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
