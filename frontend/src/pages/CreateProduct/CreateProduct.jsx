import "./CreateProduct.css";
import { useState, useEffect } from "react";
import { UseAuthStore } from "../../stores/UseAuthStore";
import { UseProductStore } from "../../stores/UseProductStore";
import ProductForm from "../../components/forms/ProductForm/ProductForm";


function CreateProduct() {
  const username = UseAuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");

  const fetchProducts = UseProductStore((state) => state.fetchProducts);

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
    const url = `http://localhost:8080/vanessa-vinicyus-proj3/rest/users/${username}/addProducts`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error("Erro ao criar o produto");

      alert("Produto criado com sucesso!");
      await fetchProducts();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/category/all"
        );
        if (!response.ok) throw new Error("Erro ao buscar categorias");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
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
