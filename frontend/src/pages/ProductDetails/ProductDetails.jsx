import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";
import EditProductModal from "../../components/modals/EditProductModal/EditProductModal";
import ProductInfo from "../../components/products/ProductInfo/ProductInfo";
import { Service } from "../../Services/Services";
import "./ProductDetails.css";

function ProductDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const navigate = useNavigate();

  const username = useAuthStore((state) => state.username);
  const isAdmin = useAuthStore((state) => state.admin);
  const token = useAuthStore((state) => state.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    selectedProduct: product,
    fetchProductById,
    updateProductByUser,
    updateProductByAdmin,
    deleteProduct,
  } = useProductStore();

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        await fetchProductById(productId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, fetchProductById]);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleEditClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
    <main id="main-div-product" className="container mt-5 mb-5 border rounded shadow p-4 bg-white text-dark">
      <div id="product-details" className="row">
        {/* Coluna para a imagem */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div className="image-container">
            <img
              id="product-detail-image"
              src={product.picture}
              className="img-fluid rounded shadow p-3"
              alt={`Imagem do produto: ${product.title}`}
            />
          </div>
        </div>

        {/* Coluna para as informações do produto */}
        <div className="col-12 col-md-6 pt-4">
          <ProductInfo
            product={product}
            username={username}
            isAdmin={isAdmin}
            onEdit={handleEditClick}
            onDelete={() => alert("Produto inativado!")}
            onDeletePermanent={() => alert("Produto apagado permanentemente!")}
            onBuy={buyProduct}
          />
        </div>
      </div>

      {/* Modal de edição */}
      {isModalOpen && (
        <EditProductModal
          editedProduct={editedProduct}
          onChange={(e) =>
            setEditedProduct((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          onSave={() => alert("Produto atualizado!")}
          onClose={handleCloseModal}
          isAdmin={isAdmin}
        />
      )}
    </main>
  );
}

export default ProductDetails;
