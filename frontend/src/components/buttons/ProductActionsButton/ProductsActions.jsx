import "./ProductsActions.css";

const ProductActions = ({ isOwner, isAdmin, onEdit, onDelete, onBuy, onDeletePermanent }) => {
  return (
    <div id="action-buttons">
      {/* DONO PRODUTO */}
      {/* um usuário normal */}
      {isOwner && !isAdmin && (
        <>
          <button onClick={onEdit} className="button">
            Edit Product
          </button>
          <button onClick={onDelete} className="button">
            Inactivate Product
          </button>
        </>
      )}

      {/* usuário admin */}
      {isOwner && isAdmin && (
        <>
          <button onClick={onEdit} className="button">
            Edit Product
          </button>
          <button onClick={onDelete} className="button">
            Inactivate Product
          </button>
          <button onClick={onDeletePermanent} className="button">
            Delete Product
          </button>
        </>
      )}

      {/* NAO É DONO PRODUTO */}
      {/* usuário normal */}
      {!isOwner && !isAdmin && (
        <>
          <button className="button" onClick={onBuy}>
            Buy
          </button>
        </>
      )}

      {/* usuário admin */}
      {!isOwner && isAdmin && (
        <>
          <button className="button" onClick={onBuy}>
            Buy
          </button>
          <button className="button" onClick={onEdit}>
            Edit Product
          </button>
          <button className="button" onClick={onDelete}>
            Inactivate Product
          </button>
          <button onClick={onDeletePermanent} className="button">
            Delete Product
          </button>
        </>
      )}
    </div>
  );
};

export default ProductActions;
