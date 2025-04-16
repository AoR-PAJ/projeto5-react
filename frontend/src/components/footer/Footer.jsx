import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Sobre nós</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Trabalhe Connosco
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  Nossa Missão
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  Apoie-nos
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Suporte</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Contacto
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  Segurança
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  Livro de Reclamações
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Dúvidas</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Como comprar
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Taxas
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;