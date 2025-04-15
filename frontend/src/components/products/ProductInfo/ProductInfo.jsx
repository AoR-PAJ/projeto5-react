import React from "react";
import ProductActions from "../../buttons/ProductActionsButton/ProductsActions";

// Formulário para exibir as informacoes de um produto
function ProductInfo({ product, username, isAdmin, onEdit, onDelete, onBuy, onDeletePermanent }) {
  //exibe uma mensagem de erro caso o produto nao seja encontrado
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="text-container" id="product-info">
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
        <strong>Seller:</strong> <span>{product.creatorInfo || "Deleted User"}</span>
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
        onDeletePermanent={onDeletePermanent}
        onBuy={onBuy}
      />
    </div>
  );
}

export default ProductInfo;
