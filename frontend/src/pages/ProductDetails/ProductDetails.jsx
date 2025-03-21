import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthStore } from "../../stores/AuthStore";

import "./ProductDetails.css";

function ProductDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const username = AuthStore((state) => state.username);
  const isAdmin = AuthStore((state) => state.admin);
  const token = sessionStorage.getItem("token");

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
        setEditedProduct(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // atualizacao dos dados do produto para um user normal
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/admin/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({
            title: editedProduct.title,
            price: parseFloat(editedProduct.price), 
            description: editedProduct.description,
            location: editedProduct.location,
            picture: editedProduct.picture,
            status: editedProduct.status.toUpperCase(), 
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }

      const updatedProductResponse = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/products/${productId}`
      );

      if (!updatedProductResponse.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }


      const updatedProduct = await updatedProductResponse.json();

      setProduct(updatedProduct);

      alert("Informacao atualizada com sucesso!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Erro ao atualizar o produto.");
    }
  };

  //atualizacao dos dados do produto para um admin
  const handleSaveChangesForAdmin = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/admin/products/updateProductOther/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({
            title: editedProduct.title,
            price: parseFloat(editedProduct.price),
            description: editedProduct.description,
            location: editedProduct.location,
            picture: editedProduct.picture,
            status: editedProduct.status.toUpperCase(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }
      
      const updatedProductResponse = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/products/${productId}`
      );

      if (!updatedProductResponse.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }

      const updatedProduct = await updatedProductResponse.json();

      setProduct(updatedProduct);

      alert("Informação atualizada com sucesso!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Erro ao atualizar o produto.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <main id="main-div" className="clearfix">
      <div id="product-details">
        <div className="product-detail-container">
          <div className="image-container">
            <img
              id="product-detail-image"
              src={product.picture}
              className="product-image"
              alt="Product"
            />
          </div>

          <div className="text-container" id="product-info">
            <p>
              Title: <span>{product.title}</span>
            </p>
            <p>
              Category: <span>{product.category}</span>
            </p>
            <p>
              Price: <span>{product.price}</span>€
            </p>
            <p>
              Description: <span>{product.description}</span>
            </p>
            <p>
              Seller: <span>{product.seller}</span>
            </p>
            <p>
              Location: <span>{product.location}</span>
            </p>
            <p>
              Publication: <span>{product.date}</span>
            </p>
            <p>
              Alteration: <span>{product.alterationDate}</span>
            </p>
            <p>
              State: <span>{product.status}</span>
            </p>
            <p>
              Image: <span>{product.picture}</span>
            </p>

            <div id="action-buttons">
              {/* user: normal e owner */}
              {username === product.seller && (
                <>
                  <button onClick={handleEditClick} className="button">
                    Edit Product
                  </button>
                  <button className="button">Delete Product</button>
                </>
              )}

              {/* user:admin e not owner */}

              {username !== product.seller && (
                <>
                  <button className="button">Buy</button>
                  <button onClick={handleEditClick} className="button">
                    Edit Product
                  </button>
                </>
              )}

              {/* user: admin */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Product</h3>

            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editedProduct.title}
              onChange={handleInputChange}
            />

            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={editedProduct.price}
              onChange={handleInputChange}
            />

            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
            />

            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={editedProduct.location}
              onChange={handleInputChange}
            />

            <label>Image URL:</label>
            <input
              type="text"
              name="picture"
              value={editedProduct.picture}
              onChange={handleInputChange}
            />

            <label>Status:</label>
            <select
              name="status"
              value={editedProduct.status}
              onChange={handleInputChange}
            >
              <option value="PUBLICADO">PUBLICADO</option>
              <option value="RESERVADO">RESERVADO</option>
              <option value="DISPONIVEL">DISPONIVEL</option>
            </select>

            <div className="modal-buttons">
              <button
                onClick={
                  isAdmin ? handleSaveChangesForAdmin : handleSaveChanges
                }
                className="button"
              >
                Save changes
              </button>
              <button onClick={handleCloseModal} className="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetails;
