import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useAuthStore } from "../../stores/useAuthStore";
import AddCategoryButton from "../../components/buttons/AddCategoryButton/AddCategoryButton";
import UserFilter from "../../components/filter/UsersFilter/UsersFilter";
import CategoryFilter from "../../components/filter/CategoryFilter/CategoryFilter";
import ProductList from "../../components/list/ProductList/ProductList";
import Banner from "../../components/banner/Banner";
import SearchBar from "../../components/searchbar/SearchBar";
import { useNavigate } from "react-router-dom";

//Servicos
import { Service } from "../../Services/Services";

//Estilos
import "./HomePage.css";

function HomePage() {
  const Navigate = useNavigate();
  //obtem as categorias
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  //verifica as credenciais do user conectado
  const isAdmin = useAuthStore((state) => state.admin);
  const token = useAuthStore((state) => state.token);

  // Estado para armazenar produtos filtrados
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estado para armazenar os utilizadores registados
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Todos");

  // Buscar categorias ao carregar a página
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categories = await Service.fetchCategories();
        fetchCategories(categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategoriesData();
  }, [fetchCategories]);

  // Buscar utilizadores 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Service.fetchUsers(token);
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);
      }
    };
    fetchUsers();
  }, [token]);

  // Buscar produtos filtrados por categoria ou utilizador
  useEffect(() => {
    const fetchProducts = async () => {
      let products = [];

      if (selectedCategory !== "Todos") {
        // Buscar produtos por categoria
        products = await Service.fetchProductsByCategory(selectedCategory);
      } else if (selectedUser !== "Todos") {
        // Buscar produtos por usuário
        products = await Service.fetchProductsByUser(selectedUser, token);
      } else {
        // Buscar todos os produtos
        products = await Service.fetchAllProducts();
      }

      // Filtrar produtos com status "PUBLICADO" ou "DISPONIVEL"
      const publicProducts = products.filter(
        (product) =>
          product.status === "PUBLICADO" || product.status === "DISPONIVEL"
      );
      setFilteredProducts(publicProducts);
    };

    fetchProducts();
  }, [selectedCategory, selectedUser, token]);

  return (
    <div className="homePage-wrapper">
      <Banner />
      <SearchBar />

      <main id="main-div">
        <div id="sidebar-div">
          {/* Filtro por Categoria */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* botao para adicionar categoria */}
          {isAdmin && token && <AddCategoryButton />}
        </div>

        <div  className="flex d-flex justify-content-center align-items-center flex-column">
          {/* Lista de Produtos */}
          <ProductList filteredProducts={filteredProducts} />

          {/* Botao para a lista completa de produtos */}
          <button className="btn btn-success text-white mt-3" onClick={()=>Navigate("/all-products")}>Todos os produtos</button>
        </div>

        {/* Filtro de Utilizador(renderizado apenas se o user logado é admin) */}
        {/* {isAdmin && token && (
          <div className="filtro-utilizadores">
            <UserFilter
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        )} */}
      </main>
    </div>
  );
}

export default HomePage;
