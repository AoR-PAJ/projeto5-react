import "./CreateProduct.css";
//hooks
import { useState, useEffect } from "react";
import { Service } from "../../Services/Services";

//stores
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";
import { useCategoryStore } from "../../stores/useCategoryStore";

//componentes
import ProductForm from "../../components/forms/ProductForm/ProductForm";

function CreateProduct() {
  const username = useAuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");

  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    picture: "",
    price: "",
    status: "DISPONIVEL",
    title: "",
    category: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await Service.createProduct(username, token, formData);
      alert("Produto criado com sucesso!");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Carrega as categorias ao montar o componente
  useEffect(() => {
    // Chama o método da store para buscar categorias
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="create-product-container">
      <div className="create-product-wrapper">
        <main className="main-div-create-product">
          <a href="/homePage">
            <img
              className="lettering"
              src="./assets/lettering.png"
              alt="lettering"
              height="180"
            />
          </a>
          <ProductForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            categories={categories}
          />
        </main>
      </div>
    </div>
  );
}

export default CreateProduct;
