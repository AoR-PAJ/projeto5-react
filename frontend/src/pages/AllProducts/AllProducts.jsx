import React, { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { Link } from "react-router-dom";
import { Service } from "../../Services/Services";
import { useAuthStore } from "../../stores/useAuthStore";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";
import { FormattedMessage } from "react-intl";
import "./AllProducts.css"; 



function AllProducts() {
  const products = useProductStore((state) => state.products); // Obtém os produtos do store
  const fetchProducts = useProductStore((state) => state.fetchProducts); // Função para buscar todos os produtos
  const [searchParams] = useSearchParams();

  const fetchProductsByCategory = useProductStore(
    (state) => state.fetchProductsByCategory
  ); // Função para buscar por categoria

  const fetchProductsByUser = useProductStore(
    (state) => state.fetchProductsByUser
  ); // Função para buscar por usuário

  const categories = useCategoryStore((state) => state.categories); // Obtém as categorias do store
  const fetchCategories = useCategoryStore((state) => state.fetchCategories); // Função para buscar categorias

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [users, setUsers] = useState([]);

  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.admin);

  // Atualizar os produtos ao mudar o parâmetro "estado" na URL
  useEffect(() => {
    const estado = searchParams.get("estado") || "DISPONIVEL"; // Define "DISPONIVEL" como valor padrão
    if (estado) {
      fetchProducts(estado);
    } else {
      console.warn("Estado inválido detectado:", estado);
    }
  }, [searchParams, fetchProducts]);

  // Buscar categorias ao carregar a página
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Buscar usuários ao carregar a página
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await Service.fetchUsers(token); // Substitua pela sua API de usuários
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);
      }
    };
    fetchUsers();
  }, [token]);

  // Atualizar os produtos ao mudar o filtro de categoria
  useEffect(() => {
    if (selectedCategory === "all") {
      fetchProducts("DISPONIVEL"); // Busca todos os produtos se "all" for selecionado
    } else {
      fetchProductsByCategory(selectedCategory); // Busca produtos por categoria
    }
  }, [selectedCategory, fetchProducts, fetchProductsByCategory]);

  // Atualizar os produtos ao mudar o filtro de usuário
  useEffect(() => {
    if (selectedUser === "all") {
      fetchProducts("DISPONIVEL"); // Busca todos os produtos se "all" for selecionado
    } else {
      fetchProductsByUser(selectedUser, token); // Passa o username e o token
    }
  }, [selectedUser, fetchProducts, fetchProductsByUser, token]);

  return (
    <div className="container my-4">
      <Breadcrumbs />
      {/* Filtros */}
      <div className="row mb-4">
        {/* Filtro por Categoria */}
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="categoryFilter" className="form-label text-white">
            <strong>
              <FormattedMessage id="FilterByCategory" />
            </strong>
          </label>
          <select
            id="categoryFilter"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              const category = e.target.value;
              setSelectedCategory(category);
              fetchProductsByCategory(category); // Busca produtos por categoria
            }}
          >
            <option value="all"><FormattedMessage id="allCategories"/></option>
            {categories.map((category) => (
              <option key={category.nome} value={category.nome}>
                {category.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Usuário */}
        {isAdmin && (
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor="userFilter" className="form-label text-white">
              <strong>
                <FormattedMessage id="FilterByUser" />
              </strong>
            </label>
            <select
              id="userFilter"
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="all"><FormattedMessage id="allUsers"/></option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Lista de Produtos */}
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-white">
              <FormattedMessage id="anyProductsFound" />
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100 d-flex flex-column hover-effect">
                <Link to={`/product-details?id=${product.id}`}>
                  <img
                    src={product.picture}
                    className="card-img-top"
                    alt={product.title}
                    style={{ objectFit: "cover", height: "200px" }} // Garante que a imagem tenha um tamanho consistente
                  />
                </Link>
                <div className="card-body mt-auto">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">
                    <strong><FormattedMessage id="price"/></strong> {product.price}
                    <br />
                    <strong><FormattedMessage id="category"/></strong> {product.category}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllProducts;
