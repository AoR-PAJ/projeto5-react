import React, { useState, useEffect } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { FormattedMessage, useIntl } from "react-intl";

const CategoryStatus = () => {
  const intl = useIntl();

  const fetchCategoriesSortedByProductCount = useCategoryStore(
    (state) => state.fetchCategoriesSortedByProductCount
  ); // Função para buscar categorias ordenadas por contagem de produtos
  const createCategory = useCategoryStore((state) => state.createCategory); // Função para criar uma nova categoria

  const categoriesWithProductCount = useCategoryStore(
    (state) => state.categoriesWithProductCount
  ); // Categorias com contagem de produtos

  // Estados locais
  const [newCategory, setNewCategory] = useState(""); // Nome da nova categoria
  const [error, setError] = useState(null); // Mensagem de erro
  const token = useAuthStore((state) => state.token); // Token de autenticação

  // Buscar categorias ordenadas ao carregar o componente
  useEffect(() => {
    const fetchCategories = async () => {
      if (token) {
        await fetchCategoriesSortedByProductCount(token);
      }
    };

    fetchCategories();
  }, [fetchCategoriesSortedByProductCount, token]);

  // Função para adicionar uma nova categoria
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError(
        intl.formatMessage({
          id: "addCategory.error.empty",
          defaultMessage: "Por favor, insira um nome válido para a categoria.",
        })
      );
      return;
    }

    try {
      const success = await createCategory(newCategory, token);

      if (success) {
        setNewCategory(""); // Limpa o campo de entrada
        setError(null); // Limpa o erro
        await fetchCategoriesSortedByProductCount(token); // Atualiza a lista de categorias ordenadas
      } else {
        setError(
          intl.formatMessage({
            id: "addCategory.error.generic",
            defaultMessage: "Erro ao criar a categoria. Tente novamente.",
          })
        );
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setError(
        intl.formatMessage({
          id: "addCategory.error.generic",
          defaultMessage: "Erro ao criar a categoria. Tente novamente.",
        })
      );
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
            {category.nome}: {category.productCount}{" "}
            <FormattedMessage id="products" defaultMessage="produtos" />
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
            id="addCategory.label"
            defaultMessage="Adicionar Categoria"
          />
        </button>
      </div>
    </div>
  );
};

export default CategoryStatus;
