import React from "react";

const ModifiedProductsModal = ({ isOpen, onClose, modifiedProducts }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Modified Products</h2>
        {modifiedProducts.length > 0 ? (
          <div className="tableProdutos">
            <div className="cards">
              {modifiedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <a href={`product-details?id=${product.id}`}>
                    <img
                      src={product.picture}
                      alt={product.title}
                      className="product-image"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No modified products available.</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModifiedProductsModal;
