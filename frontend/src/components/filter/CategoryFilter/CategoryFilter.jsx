const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <div className="radio-group" id="categories-placeholder">
    Filter by Category: <br />
    <br />
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
      Todos
    </label>
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
      <span>Nenhuma categoria no momento</span>
    )}
  </div>
);

export default CategoryFilter;
