import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./HomePage.css";

function HomePage() {
  return(
    <div className="homePage-wrapper">
    <nav>
        <Header/>
    </nav>
    
    <div id="banner-div">
        <img src="./assets/newlogo.png" alt="Logotipo" height="320"/>
        <div className="button-container">
            <a href="#search-bar-div"className="buybutton animate-buybutton">
                Press <br />  Start Buying</a>
            <a className="sellbutton animate-sellbutton">Press <br />Start Selling</a>
        </div>
    </div>

    <div id="search-bar-div">
        <input type="text" id="search-input" placeholder="Pesquisar..."/>
        <button id="search-button">Search</button>
    </div>

    <main id="main-div" className="clearfix">
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
                <div className="cards"></div>
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
    <Footer/>
      
    </div>
  );
}

export default HomePage;