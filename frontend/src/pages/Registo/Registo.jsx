import React from "react";
import Footer from "../../components/footer/Footer";
import RegisterForm from "../../components/forms/RegisterForm/RegisterForm";

import "./Registo.css";

function Registo() {
  return (
    <div className="registo-wrapper">
      <main>
        <a href="homePage">
          <img
            className="lettering"
            src="assets/lettering.png"
            alt="lettering"
            height="180"
          />
        </a>
        <RegisterForm/>
      </main>
      <Footer />
    </div>
  );
}

export default Registo;
