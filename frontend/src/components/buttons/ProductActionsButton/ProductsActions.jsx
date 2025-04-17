import "./ProductsActions.css";
import { FormattedMessage } from "react-intl";

const ProductActions = ({ isOwner, isAdmin, onEdit, onDelete, onBuy, onDeletePermanent }) => {
  return (
    <div id="action-buttons">
      {/* DONO PRODUTO */}
      {/* um usuário normal */}
      {isOwner && !isAdmin && (
        <>
          <button onClick={onEdit} className="button">
            <FormattedMessage id="editProduct" />
          </button>
          <button onClick={onDelete} className="button">
            <FormattedMessage id="inactivateProduct" />
          </button>
        </>
      )}

      {/* usuário admin */}
      {isOwner && isAdmin && (
        <>
          <button onClick={onEdit} className="button">
            <FormattedMessage id="editProduct" />
          </button>
          <button onClick={onDelete} className="button">
            <FormattedMessage id="inactivateProduct" />
          </button>
          <button onClick={onDeletePermanent} className="button">
            <FormattedMessage id="deleteProduct" />
          </button>
        </>
      )}

      {/* NAO É DONO PRODUTO */}
      {/* usuário normal */}
      {!isOwner && !isAdmin && (
        <>
          <button className="button" onClick={onBuy}>
            <FormattedMessage id="buybutton.text" />
          </button>
        </>
      )}

      {/* usuário admin */}
      {!isOwner && isAdmin && (
        <>
          <button className="button" onClick={onBuy}>
            <FormattedMessage id="buybutton.text" />
          </button>
          <button className="button" onClick={onEdit}>
            <FormattedMessage id="editProduct" />
          </button>
          <button className="button" onClick={onDelete}>
            <FormattedMessage id="inactivateProduct" />
          </button>
          <button onClick={onDeletePermanent} className="button">
            <FormattedMessage id="deleteProduct" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductActions;
