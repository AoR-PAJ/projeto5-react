import React from "react";
import "./UserProductsModal.css"; // Importa o arquivo CSS
import { FormattedMessage, useIntl } from "react-intl"; 

const UserProductsModal = ({ isOpen, onClose, products }) => {

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2>
            <FormattedMessage id="myProducts.text" />
          </h2>
        </div>
        <div className="custom-modal-body">
          {products.length > 0 ? (
            <div className="custom-products-grid">
              {products.map((product) => (
                <div key={product.id} className="custom-product-card">
                  <a href={`/product-details?id=${product.id}`}>
                    <img
                      src={product.picture}
                      alt={product.title}
                      className="custom-product-image"
                    />
                    <div className="custom-product-info">
                      <p className="custom-product-category">
                        {product.category}
                      </p>
                      <p className="custom-product-title">{product.title}</p>
                      <p className="custom-product-price">{product.price}€</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No products available.</p>
          )}
        </div>
        <div className="custom-modal-footer">
          <button className="custom-close-button btn btn-danger" onClick={onClose}>
            <FormattedMessage id="close.text" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProductsModal;
