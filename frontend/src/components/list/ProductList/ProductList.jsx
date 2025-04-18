import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./ProductList.css"; // Adicione um arquivo CSS para os estilos personalizados

// Exibe a lista com os produtos filtrados
const ProductList = ({ filteredProducts }) => (
  <div className="container my-4">
    {/* Título da lista de produtos */}
    <div className="text-center mb-4">
      <h3>
        <FormattedMessage
          id="productlist.text"
          defaultMessage="Lista de Produtos"
        />
      </h3>
    </div>

    {/* Verifica se há produtos */}
    {filteredProducts.length > 0 ? (
      <div className="row">
        {filteredProducts.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card h-100 shadow-sm product-card">
              <Link
                to={`/product-details?id=${product.id}`}
                className="text-decoration-none"
              >
                <img
                  src={product.picture}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-dark">{product.title}</h5>
                  <p className="card-text text-muted mb-1">
                    <strong>Categoria:</strong> {product.category}
                  </p>
                  <p className="card-text text-success">
                    <strong>Preço:</strong> {product.price}€
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Caso não existam produtos, exibe a mensagem
      <div className="text-center">
        <p className="text-muted">
          <FormattedMessage
            id="noProducts.text"
            defaultMessage="Nenhum produto disponível."
          />
        </p>
      </div>
    )}
  </div>
);

export default ProductList;
