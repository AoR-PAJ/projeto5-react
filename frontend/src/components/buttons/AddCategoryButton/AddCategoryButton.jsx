import { useState } from "react";
import "./AddCategoryButton.css";
import { UseCategoryStore } from "../../../stores/UseCategoryStore";

function AddCategoryButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // Função para abrir o modal
  const openModal = () => setIsModalOpen(true);

  // Função para fechar o modal
  const closeModal = () => {
    setCategoryName("");
    setIsModalOpen(false);
  };

  // Função para criar a categoria
  const createCategory = async (categoryName) => {
    if (categoryName.trim()) {
      //fazendo fetch para criar a categoria
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/category/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ nome: categoryName }),
          }
        );

        if (response.ok) {
          alert("Nova categoria criada ", categoryName);
          UseCategoryStore.getState().addCategory(categoryName);
          closeModal();
        } else {
          alert("Categoria já existe!");
        }
      } catch (Error) {
        console.error("Erro ao criar categoria ", Error);
      }
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
              <button
                onClick={() => createCategory(categoryName)}
                className="create-button"
              >
                Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddCategoryButton;
