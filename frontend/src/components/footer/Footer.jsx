import React from "react";
import "./Footer.css";
import { FormattedMessage } from "react-intl";

function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>
              <FormattedMessage id="aboutus.text" />
            </h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="joinUs.text" />
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="ourMission.text" />
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="suportus.text" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>
              <FormattedMessage id="suport.text" />
            </h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="contact.text" />
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="safety.text" />
                </a>
              </li>

              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="complaints.text" />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5>
              <FormattedMessage id="Doubts.text" />
            </h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="howToBuy.text" />
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="taxes.text" />
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  <FormattedMessage id="policies.text" />
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