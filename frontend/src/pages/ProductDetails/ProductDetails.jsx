import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";

import EditProductModal from "../../components/modals/EditProductModal/EditProductModal";
import ProductInfo from "../../components/products/ProductInfo/ProductInfo";
import { Service } from "../../Services/Services";

//estilos
import "./ProductDetails.css";

function ProductDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const navigate = useNavigate();

  //credenciais do user conectado
  const username = useAuthStore((state) => state.username);
  const isAdmin = useAuthStore((state) => state.admin);
  const token = useAuthStore((state) => state.token);

  //controlo da interface
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //funcoes da store da controlar os produtos
  const {
    selectedProduct: product,
    fetchProductById,
    updateProductByUser,
    updateProductByAdmin,
    deleteProduct
  } = useProductStore();

  //controla os detalhes dos produtos
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

  // Atualiza o estado editedProduct quando o produto for carregado
  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  //Abre o modal de edicao do produto
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  //Fecha o modal de edicao do produto
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //COntrola a captura de informacoes inseridas no formulário de edicao
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
      await updateProductByUser(
        username,
        productId,
        {
          title: editedProduct.title,
          price: parseFloat(editedProduct.price),
          description: editedProduct.description,
          location: editedProduct.location,
          picture: editedProduct.picture,
          status: editedProduct.status.toUpperCase(),
        },
        token
      );

      alert("Informação atualizada com sucesso!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Erro ao atualizar o produto.");
    }
  };

  //atualizacao dos dados do produto para um admin
  const handleSaveChangesForAdmin = async () => {
    try {
      await updateProductByAdmin(
        username,
        productId,
        {
          title: editedProduct.title,
          price: parseFloat(editedProduct.price),
          description: editedProduct.description,
          location: editedProduct.location,
          picture: editedProduct.picture,
          status: editedProduct.status.toUpperCase(),
        },
        token
      );

      alert("Informação atualizada com sucesso!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro na atualização:", err);
      alert("Erro ao atualizar o produto.");
    }
  };

  //inativar produtos
  const handleDeleteClick = async () => {
    if (!product || !productId || !token) {
      alert("Erro: Produto ou autenticação inválida.");
      return;
    }

    try {
      await Service.inactivateProduct(
        product.seller,
        productId,
        token,
        navigate
      );
      alert("Produto inativado com sucesso!");
      navigate("/homePage");
    } catch (error) {
      console.error("Erro ao inativar produto:", error);
      alert("Erro ao tentar inativar o produto.");
    }
  };

  //apagar produtos
  const handlePermanentDeleteClick = async () => {
    if ( product.state === "INATIVO") {
      alert(
        "Erro: Produto não pode ser apagado. Certifique-se de que o status do produto é INATIVO."
      );
      return;
    }

    try {
      await Service.deleteProduct(productId, username, token);
      alert("Produto apagado permanentemente com sucesso!");
      navigate("/homePage");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao tentar apagar o produto.");
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
    <main id="main-div" className="container mt-5 mb-5">
  <div id="product-details" className="row">
    {/* Coluna para a imagem */}
    <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
      <div className="image-container">
        <img
          id="product-detail-image"
          src={product.picture}
          className="img-fluid rounded shadow"
          alt="Product"
        />
      </div>
    </div>

    {/* Coluna para as informações do produto */}
    <div className="col-12 col-md-6">
      <ProductInfo
        product={product}
        username={username}
        isAdmin={isAdmin}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDeletePermanent={handlePermanentDeleteClick}
        onBuy={buyProduct}
      />
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
