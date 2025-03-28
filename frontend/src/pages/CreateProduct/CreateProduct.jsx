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
  // credenciais do user autenticado
  const username = useAuthStore((state) => state.username);
  const token = sessionStorage.getItem("token");

  //buscando produtos e categorias
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  //estado para caso um erro ocorra
  const [error, setError] = useState(null);

  //armazena os dados inseridos no formulário para criacao do produto
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    picture: "",
    price: "",
    status: "DISPONIVEL",
    title: "",
    category: "",
  });

  //controla a captura de inputs no formmulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //controla o envio do formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.picture.trim() ||
      !formData.price.trim() ||
      !formData.category.trim()
    ) {
      setError("Todos os campos são obrigatórios!");
      alert("Falta preencher campos!");
      return;
    }

    // Verifica se o campo de preço é válido (apenas números)
    const priceRegex = /^\d+(\.\d{1,2})?$/;//regex que permite apenas numeros com até 2 casas decimais
    if (!priceRegex.test(formData.price)) {
      setError(
        "O preço deve ser um número válido com até duas casas decimais."
      );
      alert("Preço inválido!");
      return;
    }

    try {
      //request para criar o prodto
      await Service.createProduct(username, token, formData);
      alert("Produto criado com sucesso!");
      await fetchProducts(); //atualiza a lista de produtos

      // Reseta o formulário após a criação bem-sucedida
      setFormData({
        description: "",
        location: "",
        picture: "",
        price: "",
        status: "DISPONIVEL",
        title: "",
        category: "",
      });
      setError(null);
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
