import React from "react";
import { FormattedMessage } from "react-intl";

// Componente que exibe a imagem principal na homepage
const Banner = () => (
  <div id="banner-div" className="container-fluid text-center py-4">
    <div className="container">
      <div className="row align-items-center">
        {/* Imagem do Banner */}
        <div className="col-12">
          <img
            src="./assets/newlogo.png"
            alt="Logotipo"
            className="img-fluid"
            style={{ maxHeight: "320px" }}
          />
        </div>

        {/* Botões do Banner */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-center gap-3">
            <a
              href="#search-bar-div"
              className="btn btn-primary buybutton animate-buybutton"
            >
              <FormattedMessage id="buybutton.text" />
            </a>
            <a
              href="/create-product"
              className="btn btn-danger sellbutton animate-sellbutton"
            >
              <FormattedMessage id="sellbutton.text" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Banner;
