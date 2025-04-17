import React from "react";
import ProductActions from "../../buttons/ProductActionsButton/ProductsActions";
import { FormattedMessage } from "react-intl";

// Formulário para exibir as informacoes de um produto
function ProductInfo({ product, username, isAdmin, onEdit, onDelete, onBuy, onDeletePermanent }) {
  //exibe uma mensagem de erro caso o produto nao seja encontrado
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="text-container" id="product-info">
      <p>
        <strong>
          <FormattedMessage id="title" />:
        </strong>{" "}
        <span>{product.title}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="category" />:
        </strong>{" "}
        <span>{product.category}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="price" />:
        </strong>{" "}
        <span>{product.price}</span>€
      </p>
      <p>
        <strong>
          <FormattedMessage id="description" />:
        </strong>{" "}
        <span>{product.description}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="seller" />:
        </strong>{" "}
        <span>{product.creatorInfo || "Deleted User"}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="location" />:
        </strong>{" "}
        <span>{product.location}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="publication" />:
        </strong>{" "}
        <span>{product.date}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="alteration" />:
        </strong>{" "}
        <span>{product.alterationDate}</span>
      </p>
      <p>
        <strong>
          <FormattedMessage id="state" />:
        </strong>{" "}
        <span>{product.status}</span>
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
