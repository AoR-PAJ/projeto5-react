import "./EditProductModal.css";

function EditProductModal({
  editedProduct,
  onChange,
  onSave,
  onClose,
  isAdmin,
}) {
  // Caso não exista produtos editados, não exibe o modal
  if (!editedProduct) return null;

  // Função que será chamada quando o botão "Save changes" for clicado
  const handleSave = () => {
    // Validação do preço: deve ser um número com até 2 casas decimais
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(editedProduct.price)) {
      alert("O preço deve ser um número válido com até 2 casas decimais.");
      return;
    }

    // Validação dos campos obrigatórios (Title, Description, Location)
    if (
      !editedProduct.title.trim() ||
      !editedProduct.description.trim() ||
      !editedProduct.location.trim() ||
      !editedProduct.picture.trim()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Se a validação passar, chama a função onSave para salvar os dados
    onSave();
  };

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
          required
          maxLength={50}
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
          maxLength={200}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={editedProduct.location}
          onChange={onChange}
          maxLength={30}
          required
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="picture"
          value={editedProduct.picture}
          onChange={onChange}
        />

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
          <button onClick={handleSave} className="button">
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
