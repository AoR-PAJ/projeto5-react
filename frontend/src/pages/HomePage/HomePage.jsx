import React, { useEffect, useState } from "react";
import { ProductStore } from "../../stores/ProductStore";
import { CategoryStore } from "../../stores/CategoryStore";
import { AuthStore } from "../../stores/AuthStore";
import { Link } from "react-router-dom";
import AddCategoryButton from "../../components/buttons/AddCategoryButton/AddCategoryButton";
import "./HomePage.css";

function HomePage() {
  const categories = CategoryStore((state) => state.categories);
  const fetchCategories = CategoryStore((state) => state.fetchCategories);
  const isAdmin = AuthStore((state) => state.admin);
  const token = sessionStorage.getItem("token");

  // Estado para armazenar produtos filtrados
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  //Estado para armazenar os users registados
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Todos");

  // Buscar categorias ao carregar a página
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  //Buscar usuários do backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/users/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Erro ao buscacr utilizadores: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Buscar produtos da API quando a categoria muda
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      let url =
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/products/all";

      if (selectedCategory !== "Todos") {
        url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/category/${selectedCategory}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar produtos");
        }
        const data = await response.json();

        // Filtra para garantir que só os PUBLICADOS aparecem
        const publicProducts = data.filter(
          (product) => product.status === "PUBLICADO"
        );
        setFilteredProducts(publicProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  return (
    <div className="homePage-wrapper">
      <div id="banner-div">
        <img src="./assets/newlogo.png" alt="Logotipo" height="320" />
        <div className="button-container">
          <a href="#search-bar-div" className="buybutton animate-buybutton">
            Press <br /> Start Buying
          </a>
          <a href="/create-product" className="sellbutton animate-sellbutton">
            Press <br />
            Start Selling
          </a>
        </div>
      </div>

      <div id="search-bar-div">
        <input
          type="text"
          id="search-input"
          className="search-bar"
          placeholder="Pesquisar..."
        />
        <button id="search-button">Search</button>
      </div>

      <main id="main-div">
        <div id="sidebar-div">
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
          {isAdmin && <AddCategoryButton />}
        </div>

        <div id="products-div">
          <div className="products-title">
            <h3>Produtos Disponíveis</h3>
          </div>
          <div className="tableProdutos">
            <div className="cards">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="card-item">
                      <Link to={`/product-details?id=${product.id}`}>
                        <img
                          src={product.picture}
                          alt={product.title}
                          className="product-image"
                        />
                        <div className="product-info">
                          <p className="categoryProduct">{product.category}</p>
                          <p className="nomeProduct">{product.title}</p>
                          <p className="precoProduct">{product.price}€</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum produto disponível.</p>
              )}
            </div>
          </div>
        </div>

        {/* Filtro por Utilizador */}
        {isAdmin && (
          <div className="filtro-utilizadores">
            <div className="radio-group" id="users-placeholder">
              Filter by Users: <br /> <br />
              <label htmlFor="utilizadores-todos">
                <input
                  id="utilizadores-todos"
                  type="radio"
                  value="Todos"
                  name="user"
                  checked={selectedUser === "Todos"}
                  onChange={() => setSelectedUser("Todos")}
                />
                Todos
              </label>
              {users.length > 0 ? (
                users.map((user) => (
                  <label key={user.username} htmlFor={user.username}>
                    <input
                      id={user.username}
                      type="radio"
                      value={user.username}
                      name="user"
                      checked={selectedUser === user.username}
                      onChange={() => setSelectedUser(user.username)}
                    />
                    {user.username}
                  </label>
                ))
              ) : (
                <span>Nenhum utilizador no momento</span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
