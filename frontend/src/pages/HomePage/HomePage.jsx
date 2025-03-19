import React from "react";
import { ProductStore } from "../../stores/ProductStore";
import { useEffect } from "react";

import "./HomePage.css";

function HomePage() {
    const products = ProductStore((state)=> state.products);
    const fetchProducts = ProductStore((state) => state.fetchProducts); // A função que busca os produtos da API

  useEffect(() => {
    fetchProducts(); // Chama a função fetchProducts para preencher a store com os produtos
  }, [fetchProducts]);

  return(
    <div className="homePage-wrapper">
    
    
    <div id="banner-div">
        <img src="./assets/newlogo.png" alt="Logotipo" height="320"/>
        <div className="button-container">
            <a href="#search-bar-div" className="buybutton animate-buybutton">
                Press <br />  Start Buying</a>
            <a href="/create-product" className="sellbutton animate-sellbutton">Press <br />Start Selling</a>
        </div>
    </div>

    <div id="search-bar-div">
        <input type="text" id="search-input" placeholder="Pesquisar..."/>
        <button id="search-button">Search</button>
    </div>

    <main id="main-div" >
        <div id="sidebar-div">
            <div className="radio-group" id="categories-placeholder"> Filter by Category: <br/><br/>
                <label id="label-category-todos" htmlFor="categoryTodos">
                    <input id="categoryTodos" type="radio" value="Todos" name="category" required=""/> 
                    Todos
                </label><br/><br/>
            </div>
        </div>
        <div id="products-div">
            <div className="tableProdutos">
                <div className="cards">
                   {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="card-item">
                        <a href={`product-details.html?id=${product.id}`}>
                            <img src={product.picture} alt={product.title} className="product-image" />
                            <div className="product-info">
                                <p className="categoryProduct">{product.category}</p>
                                <p className="nomeProduct">{product.title}</p>
                                <p className="precoProduct">{product.price}€</p>
                            </div>
                        </a>

                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum produto disponível.</p>
              )}
                </div>
            </div>
        </div>
        <div className="filtro-utilizadores">
            <div className="radio-group" id="users-placeholder"> Filter by Users: <br/> <br/>
                <label id="label-produtos-todos" htmlFor="utilizadores-todos">
                    <input id="utilizadores-todos" type="radio" value="Todos" name="category" required=""/> 
                    Todos
                </label><br/><br/>
            </div>
        </div>
    </main>
    
      
    </div>
  );
}

export default HomePage;