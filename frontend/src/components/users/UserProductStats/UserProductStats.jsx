import React, { useState, useEffect } from "react";
import { Service } from "../../../Services/Services";
import { FormattedMessage, useIntl } from "react-intl"; 

const UserProductStats = ({ username, token }) => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const stats = await Service.getUserProductsStats(username, token);
        setProducts(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStats();
  }, [username, token]);

  if (loading) {
    return <p>Carregando estatísticas...</p>;
  }

  if (error) {
    return <p className="text-danger">Erro: {error}</p>;
  }

  if (!products) {
    return <p>Nenhuma estatística disponível.</p>;
  }

  const { total, draft, published, reserved, purchased, inactive, available } =
    products;

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <FormattedMessage id="productsEstatistics.text" />
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Total de Produtos */}
          <div className="col-12 mb-3">
            <h6 className="text-center">
              <strong>
                <FormattedMessage id="totalProducts.text" />:
              </strong>{" "}
              {total}
            </h6>
          </div>

          {/* Distribuição por Estado */}
          <div className="col-12 col-md-6">
            <p>
              <strong>
                <FormattedMessage id="draft.text" />:
              </strong>{" "}
              {draft}
            </p>
            <p>
              <strong>
                <FormattedMessage id="published.text" />:
              </strong>{" "}
              {published}
            </p>
            <p>
              <strong>
                <FormattedMessage id="available.text" />:
              </strong>{" "}
              {available}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p>
              <strong>
                <FormattedMessage id="reserved.text" />:
              </strong>{" "}
              {reserved}
            </p>
            <p>
              <strong>
                <FormattedMessage id="bought.text" />:
              </strong>{" "}
              {purchased}
            </p>
            <p>
              <strong>
                <FormattedMessage id="inactive.text" />:
              </strong>{" "}
              {inactive}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProductStats;
