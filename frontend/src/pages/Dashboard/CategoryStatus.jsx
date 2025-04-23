import React, { useState, useEffect } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { FormattedMessage, useIntl } from "react-intl";

const CategoryStatus = () => {
  const intl = useIntl();
  const categories = useCategoryStore((state) => state.categories); // Obtém as categorias do store
  const fetchCategories = useCategoryStore((state) => state.fetchCategories); // Função para buscar categorias do backend
  const createCategory = useCategoryStore((state) => state.createCategory); // Função para criar a categoria no backend
  const [newCategory, setNewCategory] = useState(""); // Estado para armazenar o nome da nova categoria
  const [error, setError] = useState(null); // Estado para erros
  const token = useAuthStore((state) => state.token); 

  // Buscar categorias ao carregar o componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Por favor, insira um nome válido para a categoria.");
      return;
    }

    try {
      const success = await createCategory(newCategory, token);

      if (success) {
        setNewCategory(""); // Limpa o campo de entrada
        setError(null); // Limpa o erro
        fetchCategories(); // Recarrega a lista de categorias do backend
      } else {
        setError("Erro ao criar a categoria. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setError("Erro ao criar a categoria. Tente novamente.");
    }
  };

  return (
    <div>
      <h5>
        <FormattedMessage
          id="categorystatistics.title"
          defaultMessage="Estatísticas de Categorias"
        />
      </h5>

      {/* Lista de Categorias */}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.nome}</li>
        ))}
      </ul>

      {/* Formulário para adicionar nova categoria */}
      <div className="mt-4">
        <label htmlFor="newCategory" className="form-label">
          <FormattedMessage
            id="addCategory.label"
            defaultMessage="Adicionar Nova Categoria"
          />
        </label>
        <input
          id="newCategory"
          type="text"
          className="form-control"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder={intl.formatMessage({
            id: "addCategory.placeholder",
            defaultMessage: "Digite o nome da nova categoria",
          })}
        />
        {error && <p className="text-danger mt-2">{error}</p>}
        <button className="btn btn-success mt-3" onClick={handleAddCategory}>
          <FormattedMessage
            id="addCategory.button"
            defaultMessage="Adicionar Categoria"
          />
        </button>
      </div>
    </div>
  );
};

export default CategoryStatus;
