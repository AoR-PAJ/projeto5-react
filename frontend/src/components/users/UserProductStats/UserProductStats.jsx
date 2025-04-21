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
    <div>
      <h5 className="text-primary text-center mb-4">
        <FormattedMessage id="productsEstatistics.text" />
      </h5>
      <div className="row">
        {/* Total de Produtos */}
        <div className="col-12 mb-3">
          <div className="alert alert-info text-center">
            <strong>
              <FormattedMessage id="totalProducts.text" />:
            </strong>{" "}
            {total}
          </div>
        </div>

        {/* Distribuição por Estado */}
        <div className="col-12 col-md-6">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="RASCUNHO.text" />:
              <span className="badge bg-primary">{draft}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="published.text" />:
              <span className="badge bg-success">{published}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="DISPONIVEL.text" />:
              <span className="badge bg-info">{available}</span>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-6">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="reserved.text" />:
              <span className="badge bg-warning text-dark">{reserved}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="COMPRADO.text" />:
              <span className="badge bg-secondary">{purchased}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <FormattedMessage id="INATIVO.text" />:
              <span className="badge bg-danger">{inactive}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProductStats;
