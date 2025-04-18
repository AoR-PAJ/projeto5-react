import React from "react";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// Esta página será exibida caso uma rota que não faça parte do router seja acessada
function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page d-flex flex-column align-items-center justify-content-center vh-100">
      <img
        src="https://img.freepik.com/vetores-gratis/ups-erro-404-com-ilustracao-de-conceito-de-robo-quebrado_114360-5529.jpg"
        alt="error image"
        className="error-image img-fluid"
        onClick={() => navigate("/homePage")}
      />

      <div className="text-center mt-4">
        <h1>
          404 - <FormattedMessage id="pageNotFound" />
        </h1>
        <p>
          <FormattedMessage id="pageNotFound.description" />
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
