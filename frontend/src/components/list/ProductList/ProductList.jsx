import { Link } from "react-router-dom";

const ProductList = ({ filteredProducts }) => (
  <div id="products-div">
    <div className="products-title">
      <h3>Produtos Disponíveis</h3>
    </div>
    <div className="tableProdutos">
      <div className="cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id}>
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
);

export default ProductList;
