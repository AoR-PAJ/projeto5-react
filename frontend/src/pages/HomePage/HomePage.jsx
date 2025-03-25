import React, { useEffect, useState } from "react";
import { UseCategoryStore } from "../../stores/UseCategoryStore";
import { UseAuthStore } from "../../stores/UseAuthStore";
import AddCategoryButton from "../../components/buttons/AddCategoryButton/AddCategoryButton";
import UserFilter from "../../components/filter/UsersFilter/UsersFilter";
import "./HomePage.css";
import CategoryFilter from "../../components/filter/CategoryFilter/CategoryFilter";
import ProductList from "../../components/list/ProductList/ProductList";

function HomePage() {
  const categories = UseCategoryStore((state) => state.categories);
  const fetchCategories = UseCategoryStore((state) => state.fetchCategories);
  const isAdmin = UseAuthStore((state) => state.admin);
  const token = sessionStorage.getItem("token");

  // Estado para armazenar produtos filtrados
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estado para armazenar os utilizadores registados
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Todos");

  // Buscar categorias ao carregar a página
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Buscar utilizadores do backend
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
        console.error("Erro ao buscar utilizadores: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Buscar produtos filtrados por categoria ou utilizador
  useEffect(() => {
    const fetchProducts = async () => {
      let url =
        "http://localhost:8080/vanessa-vinicyus-proj3/rest/products/all";
      let headers = {};

      if (selectedCategory !== "Todos") {
        url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/category/${selectedCategory}`;
      }

      if (selectedUser !== "Todos") {
        url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/products/user/${selectedUser}`;
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Passando o token no cabeçalho
        };
      }

      try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error("Erro ao buscar produtos");
        }
        const data = await response.json();

        // Filtrar apenas produtos PUBLICADOS
        const publicProducts = data.filter(
          (product) =>
            product.status === "PUBLICADO" || product.status === "DISPONIVEL"
        );
        setFilteredProducts(publicProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedUser, token]);

  return (
    <div className="homePage-wrapper">
      <div id="banner-div">
        <img src="./assets/newlogo.png" alt="Logotipo" height="320" />
        <div className="button-container">
          <a href="#search-bar-div" className="buybutton animate-buybutton">
            Press <br /> 
            Start Buying
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
          {/* Filtro por Categoria */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* botao para adicionar categoria */}
          {isAdmin && <AddCategoryButton />}

        </div>

        {/* Lista de Produtos */}
        <ProductList 
          filteredProducts={filteredProducts}
        />

        {/* Filtro de Utilizador(renderizado apenas se o user logado é admin) */}
        {isAdmin && (
          <div className="filtro-utilizadores">
            <UserFilter
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
