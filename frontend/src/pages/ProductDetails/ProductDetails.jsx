import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import "./ProductDetails.css";

function ProductDetails() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  //fetch para obter as informações do produto visualizado
   useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/products/${productId}`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar produto");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!product) return <p>Produto não encontrado.</p>;


  return (
    <main id="main-div" className="clearfix">
      <div id="product-details">
        <div className="product-detail-container">
          <div className="image-container">
            <img id="product-detail-image" src={product.picture} className="product-image" alt="Product Image" />
          </div>

          <div className="text-container" id="product-info">
            <p className="nomeProduct">Title: <span id="product-title" className="editable"> {product.title}</span></p>
            <p className="categoryProduct">Category: <span id="product-category" className="editable">{product.category}</span></p>
            <p className="precoProduct">Price: <span id="product-price" className="editable">{product.price}</span>€</p>
            <p className="categoryProduct">Description: <span id="product-description" className="editable">{product.description}</span></p>
            <p className="sellerProduct">Seller: <span id="product-seller">{product.seller}</span></p>
            <p className="categoryProduct">Location: <span id="product-location" className="editable">{product.location}</span></p>
            <p className="categoryProduct">Publication: <span id="product-date">{product.date}</span></p>
            <p className="categoryProduct">Alteration: <span id="product-alteration">{product.alterationDate}</span></p>
            <p className="categoryProduct">State: <span id="product-state">{product.status}</span></p>
            <p className="categoryProduct">Image: <span id="product-imagem">{product.picture}</span></p>

            <div id="edit-buttons"></div>
            <div id="action-buttons">
              <button id="delete-product-button" className="button">Delete Product</button>
            </div>
          </div>

          <div id="edit-form" style={{ display: "none" }}>
            <h3>Edit Your Information</h3>
            <form id="update-form">
              <label htmlFor="title">Title: </label>
              <input type="text" id="title" name="title" maxLength="10" />
              
              <label htmlFor="category">Category: </label>
              <input type="text" id="category" name="category" maxLength="15" />
              
              <label htmlFor="price">Price: </label>
              <input type="text" id="price" name="price" maxLength="6" />
              
              <label htmlFor="description">Description: </label>
              <input type="text" id="description" name="description" maxLength="30" />
              
              <label htmlFor="location">Location: </label>
              <input type="text" id="location" name="location" maxLength="30" />
              
              <button type="submit">Save changes</button>
              <button type="button" id="cancel-edit">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
