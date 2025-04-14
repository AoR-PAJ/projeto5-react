import React from "react";

const ModifiedProductsModal = ({ isOpen, onClose, modifiedProducts }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h2>Modified Products</h2>
          <button className="custom-close-button" onClick={onClose}>
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
            <p>No modified products available.</p>
          )}
        </div>
        <div className="custom-modal-footer">
          <button className="custom-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifiedProductsModal;
