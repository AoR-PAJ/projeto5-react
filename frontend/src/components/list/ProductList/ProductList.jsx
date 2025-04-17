import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

//exibe a lista com os produtos filtrados
const ProductList = ({ filteredProducts }) => (
  <div id="products-div">
    <div className="products-title">
      <h3>
        <FormattedMessage id="productlist.text" />
      </h3>
    </div>
    <div className="tableProdutos">
      <div className="cards">
        {/* verifica se há produtos em determinada categoria e os exibe */}
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
          //caso nao existam produtos exibe a informacao
          <p>Nenhum produto disponível.</p>
        )}
      </div>
    </div>
  </div>
);

export default ProductList;
