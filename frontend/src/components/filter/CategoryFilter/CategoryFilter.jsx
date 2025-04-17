import { FormattedMessage } from "react-intl";

//componente que exibe a parte que filtra os produtos com base nas categorias existentes
const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <div className="radio-group" id="categories-placeholder">
    <FormattedMessage id="categoryFilter.title" />: <br />
    <br />
    {/* exibe sempre a opcao "todos" */}
    <label id="label-category-todos" htmlFor="categoryTodos">
      <input
        id="categoryTodos"
        type="radio"
        value="Todos"
        name="category"
        required
        checked={selectedCategory === "Todos"}
        onChange={() => setSelectedCategory("Todos")}
      />
      <FormattedMessage id="categoryFilter.all" />
    </label>
    {/* carrega as demais categorias caso existam */}
    {categories.length > 0 ? (
      categories.map((category) => (
        <label key={category.id} htmlFor={category.nome}>
          <input
            id={category.nome}
            type="radio"
            value={category.nome}
            name="category"
            required
            checked={selectedCategory === category.nome}
            onChange={() => setSelectedCategory(category.nome)}
          />
          {category.nome}
        </label>
      ))
    ) : (
      <span>
        <FormattedMessage id="categoryFilter.noCategory" />
      </span>
    )}
  </div>
);

export default CategoryFilter;
