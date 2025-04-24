import React, { useState, useEffect } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { FormattedMessage, useIntl } from "react-intl";

const CategoryStatus = () => {
  const intl = useIntl();

  // Estados do Zustand
  const categories = useCategoryStore((state) => state.categories); // Categorias padrão
  const fetchCategories = useCategoryStore((state) => state.fetchCategories); // Função para buscar categorias padrão
  const createCategory = useCategoryStore((state) => state.createCategory); // Função para criar uma nova categoria

  const categoriesWithProductCount = useCategoryStore(
    (state) => state.categoriesWithProductCount
  ); // Categorias com contagem de produtos
  const fetchCategoriesSortedByProductCount = useCategoryStore(
    (state) => state.fetchCategoriesSortedByProductCount
  ); // Função para buscar categorias ordenadas por contagem de produtos

  // Estados locais
  const [newCategory, setNewCategory] = useState(""); // Nome da nova categoria
  const [error, setError] = useState(null); // Mensagem de erro
  const token = useAuthStore((state) => state.token); // Token de autenticação

  // Buscar categorias padrão ao carregar o componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Buscar categorias ordenadas ao carregar o componente
  useEffect(() => {
    fetchCategoriesSortedByProductCount();
  }, [fetchCategoriesSortedByProductCount]);

  // Função para adicionar uma nova categoria
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
        fetchCategories(); // Recarrega a lista de categorias padrão
        fetchCategoriesSortedByProductCount(); // Recarrega a lista de categorias ordenadas
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

      {/* Lista de Categorias com Contagem de Produtos */}
      <h6>
        <FormattedMessage
          id="categories.withProductCount"
          defaultMessage="Categorias Ordenadas por Quantidade de Produtos"
        />
      </h6>
      <ul>
        {categoriesWithProductCount.map((category) => (
          <li key={category.nome}>
            {category.nome}: {category.productCount} <FormattedMessage id="products"/>             
          </li>
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
