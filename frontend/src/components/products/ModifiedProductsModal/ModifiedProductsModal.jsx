import React from "react";
import { FormattedMessage, useIntl } from "react-intl"; 

const ModifiedProductsModal = ({ isOpen, onClose, modifiedProducts }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2>
            <FormattedMessage id="modifiedProducts" />
          </h2>
          <button
            className="custom-close-button btn btn-outline-danger"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          {modifiedProducts.length > 0 ? (
            <div className="custom-products-grid">
              {modifiedProducts.map((product) => (
                <div key={product.id} className="custom-product-card">
                  <a href={`/product-details?id=${product.id}`}>
                    <img
                      src={product.picture}
                      alt={product.title}
                      className="custom-product-image"
                    />
                    <div className="custom-product-info">
                      <p className="custom-product-title">{product.title}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>
              <FormattedMessage id="noModifiedProducts" />
            </p>
          )}
        </div>
        <div className="custom-modal-footer">
          <button
            className="custom-close-button btn btn-danger"
            onClick={onClose}
          >
            <FormattedMessage id="close.text" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifiedProductsModal;
