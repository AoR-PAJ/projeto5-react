import React from "react";
import { FormattedMessage } from "react-intl";
import useProductStats from "../../hooks/useProductStats"; // Importar o hook

const ProductStats = () => {
  const { total, states } = useProductStats(); // Usar o hook para obter os dados

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
            {total} {/* Exibir o total de produtos */}
          </li>
          {Object.entries(states).map(([state, count]) => (
            <li className="list-group-item" key={state}>
              <strong>
                <FormattedMessage id={`${state}.text`} />:
              </strong>{" "}
              {count} {/* Exibir a contagem de produtos por estado */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductStats;
