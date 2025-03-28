import React from "react";
import ProductActions from "../../buttons/ProductActionsButton/ProductsActions";

function ProductInfo({ product, username, isAdmin, onEdit, onDelete, onBuy }) {
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="text-container" id="product-info">

      {/* Informações do Produto */}
      <p>
        <strong>Title:</strong> <span>{product.title}</span>
      </p>
      <p>
        <strong>Category:</strong> <span>{product.category}</span>
      </p>
      <p>
        <strong>Price:</strong> <span>{product.price}</span>€
      </p>
      <p>
        <strong>Description:</strong> <span>{product.description}</span>
      </p>
      <p>
        <strong>Seller:</strong> <span>{product.seller}</span>
      </p>
      <p>
        <strong>Location:</strong> <span>{product.location}</span>
      </p>
      <p>
        <strong>Publication:</strong> <span>{product.date}</span>
      </p>
      <p>
        <strong>Alteration:</strong> <span>{product.alterationDate}</span>
      </p>
      <p>
        <strong>State:</strong> <span>{product.status}</span>
      </p>

      {/* Ações do Produto */}
      <ProductActions
        isOwner={username === product.seller}
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
        onBuy={onBuy}
      />
    </div>
  );
}

export default ProductInfo;
