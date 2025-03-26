import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

import EditProductModal from "../../components/modals/EditProductModal/EditProductModal";
import ProductActions from "../../components/buttons/ProductActionsButton/ProductsActions";
import { Service } from "../../Services/Services";

//estilos
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
  const navigate = useNavigate();

  const username = useAuthStore((state) => state.username);
  const isAdmin = useAuthStore((state) => state.admin);
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

  //deletar(inativar) produtos
  const handleDeleteClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${product.seller}/products/${productId}/inactivate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }

      const updatedProductResponse = await fetch(
        `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/products/${productId}`
      );

      if (!updatedProductResponse.ok) {
        throw new Error("Erro ao buscar produto atualizado");
      }

      const updatedProduct = await updatedProductResponse.json();

      setProduct(updatedProduct);

      alert("produto apagado com sucesso!");
      navigate("/homePage");
    } catch (err) {
      console.error("Erro ao deletar produto: ", err);
      alert("Erro ao deletar produto: ");
    }
  };

  //Comprar produto
  const buyProduct = async () => {
    try {
      await Service.buyProduct(username, productId, token);
      alert("Produto comprado com sucesso!");
      navigate("/homePage");
    } catch (err) {
      console.error("Erro ao tentar comprar um produto: ", err);
      alert("Erro ao comprar o produto.");
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

            <ProductActions
              isOwner={username === product.seller}
              isAdmin={isAdmin}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onBuy={buyProduct}
            />
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {isModalOpen && (
        <EditProductModal
          editedProduct={editedProduct}
          onChange={handleInputChange}
          onSave={isAdmin ? handleSaveChangesForAdmin : handleSaveChanges}
          onClose={handleCloseModal}
          isAdmin={isAdmin}
        />
      )}
    </main>
  );
}

export default ProductDetails;
