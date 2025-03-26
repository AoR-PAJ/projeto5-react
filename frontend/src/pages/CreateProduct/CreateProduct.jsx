import "./CreateProduct.css";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";
import ProductForm from "../../components/forms/ProductForm/ProductForm";
import { Service } from "../../Services/Services";

function CreateProduct() {
  const username = useAuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");

  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await Service.fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadCategories();
  }, []);

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
