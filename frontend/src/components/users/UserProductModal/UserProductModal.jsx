import React from "react";

const UserProductsModal = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>My Products</h2>
        {products.length > 0 ? (
          <div id="products-div">
            <div className="tableProdutos">
              <div className="cards">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <a href={`product-details?id=${product.id}`}>
                      <img
                        src={product.picture}
                        alt={product.title}
                        className="product-image"
                      />
                      <div className="product-info">
                        <p className="categoryProduct">{product.category}</p>
                        <p className="nomeProduct">{product.title}</p>
                        <p className="precoProduct">{product.price}€</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No products available.</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserProductsModal;
