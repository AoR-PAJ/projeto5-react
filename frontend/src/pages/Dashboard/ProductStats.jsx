import React from "react";
import { FormattedMessage } from "react-intl";

const ProductStats = () => {
  return (
    <div className="mb-4">
      <div className="">
        <p>
          <FormattedMessage
            id="productstats.description"
            defaultMessage="Overview of all products and their states."
          />
        </p>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="totalProducts.text" />:
            </strong>{" "}
            {/* Exemplo de valor estático */}
            150
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="draft.text" />:
            </strong>{" "}
            20
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="available.text" />:
            </strong>{" "}
            50
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="reserved.text" />:
            </strong>{" "}
            10
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="purchased.text" />:
            </strong>{" "}
            30
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="published.text" />:
            </strong>{" "}
            25
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="inactive.text" />:
            </strong>{" "}
            15
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductStats;
