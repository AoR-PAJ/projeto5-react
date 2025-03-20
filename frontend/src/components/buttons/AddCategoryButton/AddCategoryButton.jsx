import { useState } from "react";


function AddCategoryButton() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [categoryName, setCategoryName] = useState("");

  // Função para abrir o modal
  const openModal = () => setIsModalOpen(true);

  // Função para fechar o modal
  const closeModal = () => {
    setCategoryName(""); // Limpa o nome da categoria quando o modal for fechado
    setIsModalOpen(false);
  };

  // Função para criar a categoria
  const createCategory = () => {
    if (categoryName.trim()) {
      console.log("Categoria criada:", categoryName); // Lógica para criar a categoria
      closeModal(); // Fecha o modal após criar a categoria
    } else {
      alert("Por favor, insira o nome da categoria.");
    }
  };

  return (
    <>
     <button className="add-category-button" onClick={openModal}>
      Add Category
    </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Categoria</h2>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={closeModal} className="cancel-button">
                Cancelar
              </button>
              <button onClick={createCategory} className="create-button">
                Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </>
   
  )
}

export default AddCategoryButton;