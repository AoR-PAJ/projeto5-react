import "./EditProductModal.css";

function EditProductModal({
  editedProduct,
  onChange,
  onSave,
  onClose,
  isAdmin,
}) {
  //caso nao exista produtos editados nao exibe o modal
  if (!editedProduct) return null;

  //modal para editar as informacoes do produto
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Product</h3>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={editedProduct.title}
          onChange={onChange}
        />

        <label>Price:</label>
        <input
          type="text"
          name="price"
          value={editedProduct.price}
          onChange={onChange}
        />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={editedProduct.description}
          onChange={onChange}
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={editedProduct.location}
          onChange={onChange}
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="picture"
          value={editedProduct.picture}
          onChange={onChange}
        />

        {/* exibicao da mudanca de estado do produto para o caso seja admin   */}
        {isAdmin && (
          <>
            <label>Status:</label>
            <select
              name="status"
              value={editedProduct.status}
              onChange={onChange}
            >
              <option value="RESERVADO">RESERVADO</option>
              <option value="DISPONIVEL">DISPONIVEL</option>
              <option value="COMPRADO">COMPRADO</option>
            </select>
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onSave} className="button">
            Save changes
          </button>
          <button onClick={onClose} className="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;
