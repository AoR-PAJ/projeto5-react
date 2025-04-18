import React, { useState } from "react";

function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");

  // Exemplo de produtos estáticos
  const products = [
    {
      id: 1,
      title: "Produto 1",
      price: "R$ 100,00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Produto 2",
      price: "R$ 200,00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Produto 3",
      price: "R$ 300,00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      title: "Produto 4",
      price: "R$ 400,00",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="container my-4">
      {/* Filtros */}
      <div className="row mb-4">
        {/* Filtro por Categoria */}
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="categoryFilter" className="form-label text-white">
            <strong>Filtrar por Categoria</strong>
          </label>
          <select
            id="categoryFilter"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>

        {/* Filtro por Usuário */}
        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="userFilter" className="form-label text-white">
            <strong>Filtrar por Usuário</strong>
          </label>
          <select
            id="userFilter"
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">Todos os Usuários</option>
            <option value="usuario1">Usuário 1</option>
            <option value="usuario2">Usuário 2</option>
            <option value="usuario3">Usuário 3</option>
          </select>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="row">
        {products.map((product) => (
          <div
            key={product.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">
                  <strong>Preço:</strong> {product.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
